document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menu-btn");
    const sideMenu = document.getElementById("side-menu");
    const closeBtn = document.getElementById("close-btn");
    const userMenu = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");

    if (!menuBtn || !sideMenu || !closeBtn || !userMenu || !userAvatar) return;

    menuBtn.addEventListener("click", (e) => { e.stopPropagation(); sideMenu.style.right = "0px"; });
    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); sideMenu.style.right = "-260px"; });
    sideMenu.addEventListener("click", (e) => { e.stopPropagation(); });
    userAvatar.addEventListener("click", (e) => { e.stopPropagation(); userMenu.classList.toggle("active"); });
    userMenu.addEventListener("click", (e) => { e.stopPropagation(); });
    document.addEventListener("click", () => { sideMenu.style.right = "-260px"; userMenu.classList.remove("active"); });

    const heroForm = document.getElementById("ixHeroSearchForm");
    const heroInput = document.getElementById("ixHeroSearchInput");
    if (heroForm) {
        heroForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const q = heroInput?.value.trim();
            if (q) sessionStorage.setItem("safraSearch", q);
            window.location.href = "/countries/countries.html";
        });
    }

    const ixCtaGreet = document.getElementById("ixCtaUserGreet");
    if (ixCtaGreet) {
        const u = JSON.parse(localStorage.getItem("safraUser") || "null");
        if (u?.name) ixCtaGreet.textContent = "\u0645\u0631\u062D\u0628\u0627\u060C " + u.name;
    }

    const recipesScroll = document.getElementById("ixRecipesScroll");
    document.getElementById("ixArrowPrev")?.addEventListener("click", () => {
        recipesScroll?.scrollBy({ left: -300, behavior: "smooth" });
    });
    document.getElementById("ixArrowNext")?.addEventListener("click", () => {
        recipesScroll?.scrollBy({ left: 300, behavior: "smooth" });
    });

    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            scrollTopBtn.classList.toggle("ix-visible", window.scrollY > 300);
        }, { passive: true });
    }

    fetchHomeData();
});

const CONTINENT_CODE = {
    "\u0622\u0633\u064A\u0627": "asia",
    "\u0623\u0648\u0631\u0648\u0628\u0627": "europe",
    "\u0623\u0641\u0631\u064A\u0642\u064A\u0627": "africa",
    "\u0623\u0645\u0631\u064A\u0643\u0627 \u0627\u0644\u0634\u0645\u0627\u0644\u064A\u0629": "north-america",
    "\u0623\u0645\u0631\u064A\u0643\u0627 \u0627\u0644\u062C\u0646\u0648\u0628\u064A\u0629": "south-america",
    "\u0623\u0648\u0642\u064A\u0627\u0646\u0648\u0633\u064A\u0627": "oceania"
};

const API_BASE = "https://sofrh-1.onrender.com";

async function fetchHomeData() {
    try {
        const [countriesRaw, statesRaw] = await Promise.all([
            fetch(API_BASE + "/countries").then(r => r.json()),
            fetch(API_BASE + "/country-states").then(r => r.json()),
            window.SAFRA_EVENTS_READY  || Promise.resolve(),
            window.SAFRA_RECIPES_READY || Promise.resolve()
        ]);
        const countries = countriesRaw
            .filter(c => c.slug)
            .filter(c => (statesRaw[c.slug] || "active") === "active")
            .map(c => ({
                id: c.slug,
                continent: CONTINENT_CODE[c.continent] || "asia",
                name: c.name,
                desc: c.description,
                img: c.image_url
            }));
        if (countries.length) initHomePage(countries);
    } catch (_) {}
}

function pickRandom(arr, n, excludeIds) {
    const pool = excludeIds ? arr.filter(x => !excludeIds.includes(x.id)) : arr;
    const copy = [...pool];
    const result = [];
    while (result.length < n && copy.length > 0) {
        const i = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(i, 1)[0]);
    }
    return result;
}

function escH(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function escJS(s) {
    return String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'");
}

function withW(url, t) {
    if (!url) return url;
    if (url.includes("/upload/")) {
        return url.replace(/\/upload\/[^/]+\//, "/upload/" + t + "/");
    }
    return url;
}

function heroSrc(url) { return withW(url, "f_auto,q_auto:good,w_1200"); }
function gridSrc(url) { return withW(url, "f_auto,q_auto,w_600,h_450,c_fill"); }
function recipeSrc(url) { return withW(url, "f_auto,q_auto,w_320,h_320,c_fill"); }
function eventSrc(url) { return withW(url, "f_auto,q_auto,w_600,h_337,c_fill"); }

function updateFeaturedCard(c) {
    const card = document.getElementById("ixFeaturedCard");
    const img  = document.getElementById("ixFeaturedImg");
    const name = document.getElementById("ixFeaturedName");
    const desc = document.getElementById("ixFeaturedDesc");
    if (!card) return;
    card.href = "/countries/country/" + c.continent + "/" + c.id + ".html";
    if (img)  { img.src = heroSrc(c.img); img.alt = c.name; }
    if (name) name.textContent = c.name;
    if (desc) desc.textContent = c.desc;
}

function setupHeroRotation(countries) {
    if (!countries.length) return;

    countries.forEach(c => {
        const lnk = document.createElement("link");
        lnk.rel = "preload"; lnk.as = "image"; lnk.href = heroSrc(c.img);
        document.head.appendChild(lnk);
    });

    const dotsEl = document.getElementById("ixHeroDots");
    if (dotsEl) {
        dotsEl.innerHTML = countries.map((_, i) =>
            '<button class="ix-dot' + (i === 0 ? " ix-dot-active" : "") +
            '" data-idx="' + i + '" aria-label="\u0648\u062C\u0647\u0629 ' + (i + 1) + '"></button>'
        ).join("");
        dotsEl.querySelectorAll(".ix-dot").forEach(d => {
            d.addEventListener("click", () => goTo(+d.dataset.idx));
        });
    }

    const card = document.getElementById("ixFeaturedCard");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let timer = null;

    function goTo(idx) {
        if (idx === current) return;
        current = idx;
        dotsEl?.querySelectorAll(".ix-dot").forEach((d, i) =>
            d.classList.toggle("ix-dot-active", i === idx));
        if (!reduced) {
            card?.classList.add("ix-fading");
            setTimeout(() => { updateFeaturedCard(countries[idx]); card?.classList.remove("ix-fading"); }, 400);
        } else {
            updateFeaturedCard(countries[idx]);
        }
    }

    function start() {
        if (reduced) return;
        timer = setInterval(() => goTo((current + 1) % countries.length), 6000);
    }
    function stop() { clearInterval(timer); timer = null; }

    card?.addEventListener("mouseenter", stop);
    card?.addEventListener("mouseleave", start);
    card?.addEventListener("focusin", stop);
    card?.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });

    updateFeaturedCard(countries[0]);
    start();
}

function updateDestGrid(countries) {
    const grid = document.getElementById("ixDestGrid");
    if (!grid) return;
    grid.innerHTML = countries.map(c =>
        '<a href="/countries/country/' + c.continent + '/' + c.id + '.html" class="ix-dest-card">' +
        (c.img ? '<img src="' + escH(gridSrc(c.img)) + '" alt="' + escH(c.name) + '" loading="lazy">' : '') +
        '<div class="ix-dest-overlay"></div>' +
        '<div class="ix-dest-info">' +
        '<h3>' + escH(c.name) + '</h3>' +
        '<p>' + escH(c.desc) + '</p>' +
        '<span class="ix-dest-btn">\u0627\u0633\u062A\u0643\u0634\u0641</span>' +
        '</div></a>'
    ).join("");
}

function pickDiverseRecipes(n) {
    const all = window.SAFRA_RECIPES || [];
    if (!all.length) return [];
    const byCountry = {};
    all.forEach(r => { (byCountry[r.country] = byCountry[r.country] || []).push(r); });
    const ctries = Object.keys(byCountry).sort(() => Math.random() - 0.5);
    const result = [];
    for (const ct of ctries) {
        if (result.length >= n) break;
        const pool = byCountry[ct];
        result.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    while (result.length < n && all.length > result.length) {
        const r = all[Math.floor(Math.random() * all.length)];
        if (!result.find(x => x.id === r.id)) result.push(r);
    }
    return result;
}

function updateRecipes(recipes) {
    const scroll = document.getElementById("ixRecipesScroll");
    if (!scroll) return;
    scroll.innerHTML = recipes.map(r =>
        '<div class="ix-recipe-card">' +
        '<div class="ix-recipe-img-wrap">' +
        (r.img ? '<img src="' + escH(recipeSrc(r.img)) + '" alt="' + escH(r.title) + '" loading="lazy">' : '') +
        '<button class="ix-recipe-save" onclick="saveItem(\'recipe\',\'' + escJS(r.id) + '\',\'' + escJS(r.title) + '\',\'' + escJS(r.img) + '\')">\uD83C\uDF7D\uFE0F</button>' +
        '</div>' +
        '<div class="ix-recipe-body">' +
        '<p class="ix-recipe-name">' + escH(r.title) + '</p>' +
        '<a href="/recipes/recipes.html?recipe=' + encodeURIComponent(r.id) + '" class="ix-recipe-link">\u0627\u0644\u0648\u0635\u0641\u0629</a>' +
        '</div></div>'
    ).join("");
}

const AR_MONTHS = {
    "\u064A\u0646\u0627\u064A\u0631":1,"\u0641\u0628\u0631\u0627\u064A\u0631":2,
    "\u0645\u0627\u0631\u0633":3,"\u0623\u0628\u0631\u064A\u0644":4,
    "\u0645\u0627\u064A\u0648":5,"\u064A\u0648\u0646\u064A\u0648":6,
    "\u064A\u0648\u0644\u064A\u0648":7,"\u0623\u063A\u0633\u0637\u0633":8,
    "\u0633\u0628\u062A\u0645\u0628\u0631":9,"\u0623\u0643\u062A\u0648\u0628\u0631":10,
    "\u0646\u0648\u0641\u0645\u0628\u0631":11,"\u062F\u064A\u0633\u0645\u0628\u0631":12
};

function nextEventTs(dateStr) {
    const now = new Date();
    const cm = now.getMonth() + 1;
    const cy = now.getFullYear();
    for (const [name, num] of Object.entries(AR_MONTHS)) {
        if (dateStr.includes(name)) {
            const yr = num >= cm ? cy : cy + 1;
            return new Date(yr, num - 1, 1).getTime();
        }
    }
    return null;
}

function pickEvents(n) {
    const all = window.SAFRA_EVENTS || [];
    if (!all.length) return [];
    const dated = [], always = [];
    all.forEach(e => {
        const ts = nextEventTs(e.date);
        if (ts === null) always.push(e);
        else dated.push({ ...e, _ts: ts });
    });
    dated.sort((a, b) => a._ts - b._ts);
    const result = dated.slice(0, n).map(e => { const r = {...e}; delete r._ts; return r; });
    if (result.length < n) {
        const fill = pickRandom(always, n - result.length);
        result.push(...fill);
    }
    return result;
}

function updateEvents(events) {
    const grid = document.getElementById("ixEventsGrid");
    if (!grid) return;
    grid.innerHTML = events.map(e =>
        '<a href="/events/events.html?event=' + encodeURIComponent(e.id) + '" class="ix-event-card">' +
        '<div class="ix-event-img">' +
        (e.img ? '<img src="' + escH(eventSrc(e.img)) + '" alt="' + escH(e.title) + '" loading="lazy">' : '') +
        '<span class="ix-event-date">' + escH(e.date) + '</span>' +
        '</div>' +
        '<div class="ix-event-body">' +
        '<h3 class="ix-event-title">' + escH(e.title) + '</h3>' +
        '<p class="ix-event-location">\uD83D\uDCCD ' + escH(e.location) + '</p>' +
        '<span class="ix-event-btn">\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644</span>' +
        '</div></a>'
    ).join("");
}

function initHomePage(countries) {
    const heroC = pickRandom(countries, 5);
    const heroIds = heroC.map(c => c.id);
    const destC = pickRandom(countries, 6, heroIds);

    updateDestGrid(destC);
    updateRecipes(pickDiverseRecipes(6));
    updateEvents(pickEvents(3));
    setupHeroRotation(heroC);
}
