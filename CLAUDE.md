# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

سفرة (Sofrah) is an Arabic (RTL), Saudi-focused travel & food web app. It has two independently deployed halves:

- **`frontend/`** — a static multi-page site (plain HTML/CSS/JS, no build step, no bundler, no `package.json`). Deployed on Vercel. Live at https://sofrh.vercel.app.
- **`backend/`** — a single-file FastAPI app (`backend/main.py`) backed by PostgreSQL, deployed on Render. Live at https://sofrh-1.onrender.com. Image uploads go through Cloudinary.

There is no test suite, linter, or build pipeline in this repo. "Development" mostly means directly editing static HTML/JS content files. Open an HTML file in a browser (or serve `frontend/` with any static file server) to preview.

## Running the backend locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

`get_db_connection()` in `main.py` falls back to a hardcoded Render Postgres URL if `DATABASE_URL` is not set in the environment — Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are read from env vars only, with no fallback.

Note: `backend/requirements.txt` is UTF-16 encoded (an artifact from how it was created) — if editing it, preserve encoding or re-save as UTF-8 without breaking `pip install -r`.

## Frontend architecture

Every top-level page lives in its own folder with a matching `.html` + `.js` (+ sometimes `.css`) file: `index/`, `auth/` (login/signup), `countries/`, `events/`, `recipes/`, `plan/`, `profile/`. All pages share the same header/nav/side-menu/footer boilerplate copy-pasted across files (there is no templating system), and all include:

```html
<script src="/countries/countries.js"></script>  <!-- or the page-specific equivalent -->
<script src="/auth/auth.js"></script>
```

`auth.js` is the single source of truth for: session state (`localStorage.safraUser` / `safraAvatar`), the login/signup/logout flow, the `saveItem`/`loadFavorites`/`removeItem` favorites API calls, toast notifications (`showToast`), and the side-menu (`#menu-btn`/`#side-menu`/`#close-btn`) open/close behavior. Other pages' JS files must not duplicate side-menu or auth logic — they only handle page-specific search/filter/modal behavior.

All backend calls from the frontend hit the hardcoded absolute URL `https://sofrh-1.onrender.com` (no env config, no relative paths) — see `auth.js` and any favorites-related code.

### Data-driven pages: countries, recipes, events

`countries/countries.html`, `recipes/recipes.html`, and `events/events.html` are each one giant HTML file containing hundreds of repeated card blocks (not generated — hand-authored/edited directly in the HTML). Each card's content lives entirely in `data-*` attributes, and the matching `.js` file (`countries.js`, `recipes.js`, `events.js`) reads those attributes to power client-side search, category filtering, and a detail modal. There is no server-side rendering or JSON data file for these — **the HTML *is* the database**.

Filter categories (`data-region` on cards must be one of these, matched against `data-filter` on the filter buttons):
- Countries: `asia`, `europe`, `africa`, `south-america`, `north-america` (note: `oceania` exists as a continent in `plan/plan.js` but has no filter button in `countries.html`)
- Recipes: `all`, `main-foods`, `sweets`, `snacks`
- Events: `all`, `food&cafe`, `Beaches&seas`, `Safari&mountains`, `evnents&resorts` (sic — misspelled in the codebase, keep as-is), `Museums and landmarks`, `cultural`

Recipe/event cards use pipe (`|`) delimited `data-*` strings that JS splits into modal fields:
- Recipes (`.foods-card` → `.recipes-item`): `data-ingredients` and `data-spices` are flat pipe-delimited **triplets** (`name|quantity|unit` repeated), `data-sauces` can be an empty string, `data-steps` is pipe-delimited full sentences.
- Events (`.event-card` → `.event-item`): `data-activities` is pipe-delimited **icon|price pairs**; other fields (`data-location`, `data-duration`, `data-weather`, `data-airport`, `data-stay`, `data-hotel-price`, `data-event-fee`, `data-total`) are plain strings, generally priced in Saudi Riyal (SAR/﷼/ريال).

Deep links: `recipes.html?recipe={id}` and `events.html?event={id}` are read via `URLSearchParams` in `recipes.js`/`events.js`, which look up the element by `id` (`document.getElementById(recipeId)`) — **every card's `id` attribute must be unique across the whole file**, or the wrong card (or nothing) opens.

### Country detail pages (`countries/country/{continent}/{id}.html`)

One file per country, all following an identical structure (copy an existing one — e.g. `countries/country/africa/madagascar.html` — as the template for a new country):
1. Shared header/nav/side-menu boilerplate (identical across every page in the repo).
2. `.country-name` — h1 name + tagline.
3. `.cities-grid` section of `.cite` divs (one per city), each with `data-name`, `data-img`, `data-desc`, `data-historic`, `data-restaurants` (≥3), `data-cafes` (≥3), `data-events` (≥3) — all pipe-delimited "emoji + name" lists — plus a save button and `onclick="openCityModal(this)"`.
4. `.foods-grid` section of `.foods` teaser cards that deep-link to `recipes.html?recipe={id}`.
5. `.events-grid` section of `.event` teaser cards that deep-link to `events.html?event={id}`.
6. A `#cityModal` template (identical markup on every page) that `countries.js`'s `openCityModal` populates from the clicked `.cite`'s `data-*` attributes.
7. Shared footer + `<script src="/countries/countries.js">` + `<script src="/auth/auth.js">`.

Adding a new country requires touching **5 places** in total: the new `countries/country/{continent}/{id}.html` file itself, a new country-card in `countries/countries.html`, its recipes in `recipes/recipes.html`, its events in `events/events.html`, and its `countryContinent['{id}'] = '{continent}'` entry in `profile/profile.js` (used to map saved-favorite countries back to a continent). If the country already has a placeholder entry in `plan/plan.js` (see below) with `"ready": false`, remove that flag once the page/recipes/events exist.

### `plan/plan.js` — trip planner

This single ~4,600-line file contains two very different things concatenated together:
1. A large literal `const countries = [...]` array (~200 objects) with trip-planning metadata: `id`, `nameAr`, `nameEn`, `continent`, `img`, `dailyCost` (SAR/day, food+lodging+transport+activities, excludes flights), `durationMin`/`durationMax`, `tripTypes`, `activities`, `bestTime`, and optionally `"ready": false` for countries that don't have a real page/recipes/events yet (the UI shows a "🚧 قريباً" badge instead of "✅ متاح" for these — see `cardTemplate()`).
2. All of the actual quiz/wizard logic wrapped in a single `DOMContentLoaded` listener: step navigation (`showStep`), budget slider (`updateBudgetTrack`), match scoring (`calculateMatch`), result card rendering (`cardTemplate`), search/filter (`applySearchFilter`), and the "random pick" flow (`pickRandomCountry`/reroll). `getCountryLink(country)` builds the link to a country's detail page from `continent`/`id`.

When editing country data in this file, keep it inside the `countries` array only — don't touch the wizard logic below it unless the task specifically requires it.

## Conventions to follow when adding content

- All prices are in Saudi Riyal (SAR / ﷼ / ريال) — never another currency.
- Bilingual naming convention for titles/names: `"العربي – English"` (en dash `–`, not a hyphen). `saveItem(...)` calls and `<img alt>` attributes use the **Arabic-only** part of the name, not the bilingual string.
- Image paths never include `/public` and are referenced as `/img/{filename}`. Avoid apostrophes (`'`) in image filenames used inside `saveItem('...', '...', '...', '/img/....jpg')` calls — apostrophes there prematurely terminate the single-quoted JS string and break the onclick handler (rename the file reference, e.g. `M'Zab` → `Mzab`, to avoid this).
- Vercel's filesystem is case-sensitive (Linux) — new folder/file names must be lowercase to match existing convention (e.g. `europe`, not `Europe`), even though local macOS development is case-insensitive.
- All restaurant/cafe/recipe content must be halal-compliant (no alcohol, bars, nightclubs, casinos).
- New content added to a data-driven file (countries.html/recipes.html/events.html) should match the exact structure/attributes of a neighboring existing card — copy the nearest similar card as a template rather than inventing new markup.
