document.addEventListener("DOMContentLoaded", () => {

    const menuBtn    = document.getElementById("menu-btn");
    const sideMenu   = document.getElementById("side-menu");
    const closeBtn   = document.getElementById("close-btn");
    const userMenu   = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");

    if (!menuBtn || !sideMenu || !closeBtn || !userMenu || !userAvatar) return;

    menuBtn.addEventListener("click",  (e) => { e.stopPropagation(); sideMenu.style.right = "0px"; });
    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); sideMenu.style.right = "-260px"; });
    sideMenu.addEventListener("click", (e) => { e.stopPropagation(); });
    userAvatar.addEventListener("click", (e) => { e.stopPropagation(); userMenu.classList.toggle("active"); });
    userMenu.addEventListener("click",   (e) => { e.stopPropagation(); });
    document.addEventListener("click",  () => { sideMenu.style.right = "-260px"; userMenu.classList.remove("active"); });

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
const CACHE_VER  = "v5";

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
        result.push({
            id:        m[2],
            continent: m[1],
            name:      h1 ? h1.textContent.trim() : (imgEl ? imgEl.getAttribute("alt") || "" : ""),
            desc:      h2 ? h2.textContent.trim() : "",
            img:       resolveSrc(imgEl ? imgEl.getAttribute("src") : "", pageUrl),
            href:      "/countries/country/" + m[1] + "/" + m[2] + ".html"
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
    if (img && c.img) { img.src = heroSrc(c.img); img.alt = c.name; }
    if (name) name.textContent = c.name;
    if (desc) desc.textContent = c.desc;
}

function setupHeroRotation(countries) {
    if (!countries.length) return;

    countries.forEach(c => {
        if (!c.img) return;
        const lnk = document.createElement("link");
        lnk.rel = "preload"; lnk.as = "image"; lnk.href = heroSrc(c.img);
        document.head.appendChild(lnk);
    });

    const dotsEl = document.getElementById("ixHeroDots");
    if (dotsEl) {
        dotsEl.innerHTML = countries.map((_, i) =>
            "<button class=\"ix-dot" + (i === 0 ? " ix-dot-active" : "") +
            "\" data-idx=\"" + i + "\" aria-label=\"وجهة " + (i + 1) + "\"></button>"
        ).join("");
        dotsEl.querySelectorAll(".ix-dot").forEach(d => {
            d.addEventListener("click", () => goTo(+d.dataset.idx));
        });
    }

    const card    = document.getElementById("ixFeaturedCard");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current   = 0;
    let timer     = null;

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

    card?.addEventListener("mouseenter",    stop);
    card?.addEventListener("mouseleave",    start);
    card?.addEventListener("focusin",       stop);
    card?.addEventListener("focusout",      start);
    document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });

    updateFeaturedCard(countries[0]);
    start();
}

function updateDestGrid(countries) {
    const grid = document.getElementById("ixDestGrid");
    if (!grid) return;
    grid.innerHTML = countries.map(c =>
        "<a href=\"" + escH(c.href) + "\" class=\"ix-dest-card\">" +
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
        "<div class=\"ix-recipe-img-wrap\">" +
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
        "<div class=\"ix-event-img\">" +
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
    const heroC   = pickRandom(countries, 5);
    const heroIds = heroC.map(c => c.id);
    const destC   = pickRandom(countries, 6, heroIds);

    updateDestGrid(destC);
    updateRecipes(pickDiverseRecipes(6));
    updateEvents(pickEvents(3));
    setupHeroRotation(heroC);
}
