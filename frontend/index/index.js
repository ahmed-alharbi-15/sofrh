document.addEventListener("DOMContentLoaded", () => {

    const userMenu   = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");

    if (!userMenu || !userAvatar) return;

    userAvatar.addEventListener("click", (e) => { e.stopPropagation(); userMenu.classList.toggle("active"); });
    userMenu.addEventListener("click",   (e) => { e.stopPropagation(); });
    document.addEventListener("click",  () => { userMenu.classList.remove("active"); });

    const heroForm  = document.getElementById("ixHeroSearchForm");
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
        if (u?.name) ixCtaGreet.textContent = "مرحبا، " + u.name;
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

const API_BASE   = "https://sofrh-1.onrender.com";
const CACHE_VER  = "v6";
const SI_CACHE_K = "sfr_siteimages_v1";

// ── صور الكروت الأربعة على الرئيسية ──────────────────────────────────────
function applySiteImages(images) {
    // images = { home_countries, home_events, home_recipes, home_plan }
    document.querySelectorAll('[data-key]').forEach(section => {
        const key = section.dataset.key;
        const url = images[key];
        if (!url) return;
        // ضع الصورة كخلفية للقسم (layered فوق اللون الموجود)
        section.style.setProperty('--si-bg', `url('${url}')`);
        section.classList.add('si-override');
    });
}

async function fetchSiteImages() {
    // no-flash: طبّق الكاش فوراً
    try {
        const cached = JSON.parse(localStorage.getItem(SI_CACHE_K) || 'null');
        if (cached) applySiteImages(cached);
    } catch (_) {}

    // جيب من API وحدّث
    try {
        const res = await fetch(API_BASE + "/site-images");
        if (!res.ok) return;
        const images = await res.json();
        try { localStorage.setItem(SI_CACHE_K, JSON.stringify(images)); } catch(_) {}
        applySiteImages(images);
    } catch (_) { /* لو فشل يبقى الأصلي */ }
}

// ── صور الكروت من صفحات الأقسام ──────────────────────────────────────────
function _applySectionImgs(imgs) {
    Object.entries(imgs).forEach(([key, url]) => {
        if (!url) return;
        const sec = document.querySelector(`[data-section="${key}"]`);
        if (!sec) return;
        sec.style.setProperty("--si-bg", `url('${url}')`);
        sec.classList.add("si-override");
    });
}

function _extractCountriesArray(text) {
    const idx = text.indexOf("const countries");
    if (idx === -1) return null;
    const start = text.indexOf("[", idx);
    if (start === -1) return null;
    let depth = 0, i = start;
    while (i < text.length) {
        const ch = text[i];
        if (ch === "[" || ch === "{") depth++;
        else if (ch === "]" || ch === "}") { depth--; if (depth === 0) break; }
        i++;
    }
    try { return JSON.parse(text.slice(start, i + 1)); } catch(_) { return null; }
}

async function fetchSectionImages(homeDataPromise) {
    const CACHE_K = "sfr_sect_imgs_v1";

    const imgs = {};

    // جلب الثلاث صفحات وplan.js بالتوازي
    const [ctrHtml, evHtml, rcHtml, planText] = await Promise.allSettled([
        fetch("/countries/countries.html").then(r => r.ok ? r.text() : null),
        fetch("/events/events.html").then(r => r.ok ? r.text() : null),
        fetch("/recipes/recipes.html").then(r => r.ok ? r.text() : null),
        fetch("/plan/plan.js").then(r => r.ok ? r.text() : null),
    ]).then(res => res.map(r => r.status === "fulfilled" ? r.value : null));

    // ── countries: أول .country-card أو data-featured="true" ──────────────
    if (ctrHtml) {
        try {
            const doc = new DOMParser().parseFromString(ctrHtml, "text/html");
            const baseUrl = window.location.origin + "/countries/countries.html";
            const featured = doc.querySelector('.country-card[data-featured="true"] img');
            const first    = doc.querySelector(".country-card img");
            const el = featured || first;
            if (el) imgs.countries = new URL(el.getAttribute("src") || "", baseUrl).href;
        } catch(_) {}
    }

    // ── events: data-img من أول .event-item أو data-featured="true" ────────
    if (evHtml) {
        try {
            const doc = new DOMParser().parseFromString(evHtml, "text/html");
            const featured = doc.querySelector('.event-card[data-featured="true"] .event-item')
                          || doc.querySelector('.event-item[data-featured="true"]');
            const first    = doc.querySelector(".event-card .event-item");
            const btn = featured || first;
            if (btn?.dataset.img) imgs.events = btn.dataset.img;
        } catch(_) {}
    }

    // ── recipes: img من أول .foods-card أو data-featured="true" ────────────
    if (rcHtml) {
        try {
            const doc = new DOMParser().parseFromString(rcHtml, "text/html");
            const baseUrl = window.location.origin + "/recipes/recipes.html";
            const featCard = doc.querySelector('.foods-card[data-featured="true"]')
                          || doc.querySelector('.recipes-item[data-featured="true"]')?.closest(".foods-card");
            const firstCard = doc.querySelector(".foods-card");
            const card = featCard || firstCard;
            const btn  = card?.querySelector(".recipes-item");
            const imgEl = btn?.querySelector("img");
            if (imgEl) imgs.recipes = new URL(imgEl.getAttribute("src") || "", baseUrl).href;
            else if (btn?.dataset.img) imgs.recipes = btn.dataset.img;
        } catch(_) {}
    }

    // ── plan: أول دولة ready في plan.js ────────────────────────────────────
    if (planText) {
        try {
            const countries = _extractCountriesArray(planText);
            const first = countries?.find(c => c.ready !== false);
            if (first?.img) imgs.plan = first.img;
        } catch(_) {}
    }

    // حفظ في sessionStorage
    if (Object.keys(imgs).length) {
        try { sessionStorage.setItem(CACHE_K, JSON.stringify(imgs)); } catch(_) {}
    }

    // طبّق بعد تحميل المحتوى الديناميكي
    if (homeDataPromise) {
        homeDataPromise.then(() => _applySectionImgs(imgs));
    } else {
        _applySectionImgs(imgs);
    }

    return imgs;
}

function normalize(s) {
    return String(s).toLowerCase().replace(/[\s\-_]/g, "");
}

function escH(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function escJS(s) {
    return String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'");
}

function withW(url, t) {
    if (!url) return "";
    if (url.includes("/upload/")) {
        return url.replace(/\/upload\/[^/]+\//, "/upload/" + t + "/");
    }
    return url;
}

function heroSrc(url)   { return withW(url, "f_auto,q_auto:good,w_1200"); }
function gridSrc(url)   { return withW(url, "f_auto,q_auto,w_600,h_450,c_fill"); }
function recipeSrc(url) { return withW(url, "f_auto,q_auto,w_320,h_320,c_fill"); }
function eventSrc(url)  { return withW(url, "f_auto,q_auto,w_600,h_337,c_fill"); }

function resolveSrc(src, pageUrl) {
    if (!src) return "";
    if (/^https?:\/\//.test(src)) return src;
    try { return new URL(src, pageUrl).href; } catch(e) { return src; }
}

async function loadPage(key, path, parser) {
    const K = "sfr_" + key + "_" + CACHE_VER;
    try {
        const c = sessionStorage.getItem(K);
        if (c) return JSON.parse(c);
    } catch(e) {}
    const pageUrl = window.location.origin + path;
    const html = await fetch(path).then(r => r.text());
    const data = parser(html, pageUrl);
    try { sessionStorage.setItem(K, JSON.stringify(data)); } catch(e) {}
    return data;
}

function parseCountries(html, pageUrl) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const result = [];
    doc.querySelectorAll(".country-card").forEach(card => {
        const imgEl  = card.querySelector("img");
        const h1     = card.querySelector("h1");
        const h2     = card.querySelector("h2");
        const onclick = card.getAttribute("onclick") || "";
        const m = onclick.match(/\/countries\/country\/([^/]+)\/([^.'"]+)\.html/);
        if (!m) return;
        const rawSrc = imgEl ? imgEl.getAttribute("src") : "";
        const isPlaceholder = rawSrc.includes("soon.png") || rawSrc.includes("Upgrade.jpg");
        result.push({
            id:        m[2],
            continent: m[1],
            name:      h1 ? h1.textContent.trim() : (imgEl ? imgEl.getAttribute("alt") || "" : ""),
            desc:      h2 ? h2.textContent.trim() : "",
            img:       isPlaceholder ? "" : resolveSrc(rawSrc, pageUrl),
            href:      "/countries/country/" + m[1] + "/" + m[2] + ".html",
            featured:  card.getAttribute("data-featured") === "true"
        });
    });
    return result;
}

function parseEvents(html, pageUrl) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const evs = [];
    doc.querySelectorAll(".event-card").forEach(card => {
        const btn = card.querySelector(".event-item");
        if (!btn) return;
        evs.push({
            id:       card.id,
            title:    btn.dataset.title    || "",
            img:      resolveSrc(btn.dataset.img || "", pageUrl),
            date:     (btn.dataset.date    || "").replace(/^📅\s*/, ""),
            location: btn.dataset.location || ""
        });
    });
    return evs;
}

function parseRecipes(html, pageUrl) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const recs = [];
    doc.querySelectorAll(".foods-card").forEach(card => {
        const btn = card.querySelector(".recipes-item");
        if (!btn) return;
        recs.push({
            id:      card.id,
            title:   btn.dataset.title || "",
            img:     resolveSrc(btn.dataset.img || "", pageUrl),
            country: card.dataset.country || ""
        });
    });
    return recs;
}

async function fetchHomeData() {
    try {
        const [rawCountries, statesRaw, events, recipes] = await Promise.all([
            loadPage("ctr", "/countries/countries.html", parseCountries),
            fetch(API_BASE + "/country-states").then(r => r.json()).catch(() => ({})),
            loadPage("ev",  "/events/events.html",       parseEvents),
            loadPage("rc",  "/recipes/recipes.html",     parseRecipes)
        ]);

        window.SAFRA_EVENTS  = events;
        window.SAFRA_RECIPES = recipes;

        const normStates = {};
        for (const [k, v] of Object.entries(statesRaw)) normStates[normalize(k)] = v;

        const countries = rawCountries.filter(c => {
            const st = normStates[normalize(c.id)];
            return !st || st === "active";
        });

        if (countries.length) initHomePage(countries);
        else showError();
    } catch(_) {
        showError();
    }
}

function showError() {
    const msg = "<p style=\"text-align:center;padding:40px;color:var(--text);opacity:0.5\">تعذّر تحميل البيانات</p>";
    ["ixDestGrid", "ixEventsGrid", "ixRecipesScroll"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = msg;
    });
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

function updateFeaturedCard(c) {
    const card = document.getElementById("ixFeaturedCard");
    const img  = document.getElementById("ixFeaturedImg");
    const name = document.getElementById("ixFeaturedName");
    const desc = document.getElementById("ixFeaturedDesc");
    if (!card) return;
    card.href = c.href;
    if (img) {
        if (c.img) { img.src = heroSrc(c.img); img.alt = c.name; img.style.display = ""; }
        else { img.style.display = "none"; }
    }
    if (name) name.textContent = c.name;
    if (desc) desc.textContent = c.desc;
}

function setupHeroRotation(countries) {
    if (!countries.length) return;

    // preload images
    countries.forEach(c => {
        if (!c.img) return;
        const lnk = document.createElement("link");
        lnk.rel = "preload"; lnk.as = "image"; lnk.href = heroSrc(c.img);
        document.head.appendChild(lnk);
    });

    const dotsEl  = document.getElementById("ixHeroDots");
    const card    = document.getElementById("ixFeaturedCard");
    const wrap    = document.getElementById("ixFeaturedWrap");
    const prevBtn = document.getElementById("ixSliderPrev");
    const nextBtn = document.getElementById("ixSliderNext");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // dots
    if (dotsEl) {
        dotsEl.innerHTML = countries.map((_, i) =>
            "<button class=\"ix-dot" + (i === 0 ? " ix-dot-active" : "") +
            "\" data-idx=\"" + i + "\" aria-label=\"وجهة " + (i + 1) + "\"></button>"
        ).join("");
        dotsEl.querySelectorAll(".ix-dot").forEach(d => {
            d.addEventListener("click", () => { goTo(+d.dataset.idx); restart(); });
        });
    }

    // show arrow buttons only when slider has >1 items
    if (countries.length > 1) {
        if (prevBtn) prevBtn.style.display = "";
        if (nextBtn) nextBtn.style.display = "";
    }

    let current = 0;
    let timer   = null;

    function goTo(idx) {
        const n = countries.length;
        const target = ((idx % n) + n) % n;
        if (target === current) return;
        current = target;
        dotsEl?.querySelectorAll(".ix-dot").forEach((d, i) =>
            d.classList.toggle("ix-dot-active", i === current));
        if (!reduced) {
            card?.classList.add("ix-fading");
            setTimeout(() => {
                updateFeaturedCard(countries[current]);
                card?.classList.remove("ix-fading");
            }, 380);
        } else {
            updateFeaturedCard(countries[current]);
        }
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
        if (reduced || countries.length <= 1) return;
        timer = setInterval(next, 6000);
    }
    function stop()    { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    // arrow buttons — RTL: right = السابق، left = التالي
    prevBtn?.addEventListener("click", (e) => { e.preventDefault(); prev(); restart(); });
    nextBtn?.addEventListener("click", (e) => { e.preventDefault(); next(); restart(); });

    // keyboard: السهم الأيمن = السابق، الأيسر = التالي
    document.addEventListener("keydown", (e) => {
        const rect = wrap?.getBoundingClientRect();
        if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
        if (e.key === "ArrowRight") { e.preventDefault(); prev(); restart(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); next(); restart(); }
    });

    // touch swipe — RTL: سحب لليمين = السابق، سحب لليسار = التالي
    let touchStartX = 0;
    wrap?.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        stop();
    }, { passive: true });
    wrap?.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx > 0) prev(); else next();
        }
        start();
    }, { passive: true });

    // mouse pause/resume
    card?.addEventListener("mouseenter", stop);
    card?.addEventListener("mouseleave", start);
    card?.addEventListener("focusin",    stop);
    card?.addEventListener("focusout",   start);
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });

    updateFeaturedCard(countries[0]);
    start();
}

function updateDestGrid(countries) {
    const grid = document.getElementById("ixDestGrid");
    if (!grid) return;
    grid.innerHTML = countries.map(c =>
        "<a href=\"" + escH(c.href) + "\" class=\"ix-dest-card" + (c.img ? "" : " ix-dest-no-img") + "\">" +
        (c.img ? "<img src=\"" + escH(gridSrc(c.img)) + "\" alt=\"" + escH(c.name) + "\" loading=\"lazy\">" : "") +
        "<div class=\"ix-dest-overlay\"></div>" +
        "<div class=\"ix-dest-info\">" +
        "<h3>" + escH(c.name) + "</h3>" +
        "<p>" + escH(c.desc) + "</p>" +
        "<span class=\"ix-dest-btn\">استكشف</span>" +
        "</div></a>"
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
        "<div class=\"ix-recipe-card\">" +
        "<div class=\"ix-recipe-img-wrap" + (r.img ? "" : " ix-no-img") + "\">" +
        (r.img ? "<img src=\"" + escH(recipeSrc(r.img)) + "\" alt=\"" + escH(r.title) + "\" loading=\"lazy\">" : "") +
        "<button class=\"ix-recipe-save\" onclick=\"saveItem('recipe','" + escJS(r.id) + "','" + escJS(r.title) + "','" + escJS(r.img) + "')\">&#127997;&#65039;</button>" +
        "</div>" +
        "<div class=\"ix-recipe-body\">" +
        "<p class=\"ix-recipe-name\">" + escH(r.title) + "</p>" +
        "<a href=\"/recipes/recipes.html?recipe=" + encodeURIComponent(r.id) + "\" class=\"ix-recipe-link\">الوصفة</a>" +
        "</div></div>"
    ).join("");
}

const AR_MONTHS = {
    "يناير":1, "فبراير":2,
    "مارس":3,       "أبريل":4,
    "مايو":5,       "يونيو":6,
    "يوليو":7, "أغسطس":8,
    "سبتمبر":9, "أكتوبر":10,
    "نوفمبر":11, "ديسمبر":12
};

function nextEventTs(dateStr) {
    const now = new Date();
    const cm  = now.getMonth() + 1;
    const cy  = now.getFullYear();
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
        "<a href=\"/events/events.html?event=" + encodeURIComponent(e.id) + "\" class=\"ix-event-card\">" +
        "<div class=\"ix-event-img" + (e.img ? "" : " ix-no-img") + "\">" +
        (e.img ? "<img src=\"" + escH(eventSrc(e.img)) + "\" alt=\"" + escH(e.title) + "\" loading=\"lazy\">" : "") +
        "<span class=\"ix-event-date\">" + escH(e.date) + "</span>" +
        "</div>" +
        "<div class=\"ix-event-body\">" +
        "<h3 class=\"ix-event-title\">" + escH(e.title) + "</h3>" +
        "<p class=\"ix-event-location\">📍 " + escH(e.location) + "</p>" +
        "<span class=\"ix-event-btn\">التفاصيل</span>" +
        "</div></a>"
    ).join("");
}

function initHomePage(countries) {
    const withImg   = countries.filter(c => c.img);
    const featuredC = withImg.filter(c => c.featured);
    const sliderC   = featuredC.length >= 1 ? featuredC : pickRandom(withImg, 8);
    const sliderIds = sliderC.map(c => c.id);
    const destC     = pickRandom(countries, 6, sliderIds);

    updateDestGrid(destC);
    updateRecipes(pickDiverseRecipes(12));
    updateEvents(pickEvents(6));
    setupHeroRotation(sliderC);
}
