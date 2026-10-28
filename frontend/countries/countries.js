const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-buttons button");
const cards = document.querySelectorAll(".country-card");

let activeFilter = "all";

function normalizeArabic(str) {
    return str
        .replace(/[أإآا]/g, 'ا')
        .replace(/[ةه]/g, 'ه')
        .replace(/[يىئ]/g, 'ي')
        .replace(/[ؤو]/g, 'و')
        .replace(/[\u064B-\u065F]/g, '')
        .toLowerCase();
}

function applySearchAndFilter() {
    const query = normalizeArabic((searchInput?.value || "").trim());
    cards.forEach((card) => {
        const name = normalizeArabic(card.querySelector("h1")?.textContent || "");
        const region = card.getAttribute("data-region") || "";
        const matchesSearch = name.includes(query);
        const matchesFilter = activeFilter === "all" || region === activeFilter;
        card.style.display = (matchesSearch && matchesFilter) ? "block" : "none";
    });
}

if (searchInput) searchInput.addEventListener("input", applySearchAndFilter);

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter") || "all";
        applySearchAndFilter();
    });
});

// --- City Modal ---
function openCityModal(cite) {
    const modal = document.getElementById("cityModal");
    if (!modal) return;

    document.getElementById("modalCityImg").src = cite.dataset.img || "";
    document.getElementById("modalCityName").textContent = cite.dataset.name || "";
    document.getElementById("modalCityDesc").textContent = cite.dataset.desc || "";

    const fillTags = (id, raw) => {
        const box = document.getElementById(id);
        if (!box) return;
        box.innerHTML = "";
        (raw || "").split("|").map(x => x.trim()).filter(Boolean).forEach(item => {
            const span = document.createElement("span");
            span.textContent = item;
            box.appendChild(span);
        });
    };

    fillTags("modalCityHistoric", cite.dataset.historic);
    fillTags("modalCityRestaurants", cite.dataset.restaurants);
    fillTags("modalCityCafes", cite.dataset.cafes);
    fillTags("modalCityEvents", cite.dataset.events);

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeCityModal(e) {
    const modal = document.getElementById("cityModal");
    if (!modal) return;
    const content = modal.querySelector(".modal-content");
    if (!content.contains(e.target) || e.target.classList.contains("modal-close")) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const modal = document.getElementById("cityModal");
        if (modal?.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});

// --- Recipe Modal ---
const recipeModal = document.getElementById("recipeModal");
const modalContent = recipeModal?.querySelector(".modal-content");
const closeBtnModal = recipeModal?.querySelector(".modal-close");

function openModal() {
    if (!recipeModal) return;
    recipeModal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (!recipeModal) return;
    recipeModal.style.display = "none";
    document.body.style.overflow = "auto";
}

if (closeBtnModal) closeBtnModal.addEventListener("click", closeModal);

if (recipeModal && modalContent) {
    recipeModal.addEventListener("click", (e) => {
        if (!modalContent.contains(e.target)) closeModal();
    });
}

function gramsToCups(value) { return value / 250; }
function formatCups(value) {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

const noCupsFor = [
    "لحم", "دجاج", "سمك", "سلمون", "تونة", "روبيان", "جمبري", "فيليه", "ستيك", "مفروم", "كبدة",
    "بصل", "ثوم", "طماطم", "بطاطس", "جزر", "كوسة", "باذنجان", "فلفل", "خيار", "خس", "سبانخ",
    "بروكلي", "قرنبيط", "فطر", "فاصوليا", "بازلاء", "ملفوف", "ذرة", "كرفس", "شمندر", "جرجير",
    "تفاح", "موز", "برتقال", "فراولة", "عنب", "مانجا", "أناناس", "رمان", "كيوي", "تمر", "تين",
    "خوخ", "كمثرى", "بطيخ", "شمام", "ليمون", "نودلز", "بيض", "فطر", "فول", "بسكوت", "عدس", "حلبة", "لوز", "بلح", "حبار", "كزبرة", "بط", "سلطعون", "ثلج", "شعيرية"
];

function isNoCupItem(name = "") {
    return noCupsFor.some(word => name.includes(word));
}

const noSpoonsFor = ["فطر", "بيض", "بصل", "ثوم", "حلبة", "كزبرة"];

function isNoSpoonItem(name = "") {
    return noSpoonsFor.some(word => name.includes(word));
}

function spoonsSmallText(value, name) {
    if (isNoSpoonItem(name)) return "";
    if (value <= 0) return "";
    if (value > 49) return "";
    if (value >= 1 && value <= 4) return "½ ملعقة صغيرة";
    const count = value / 5;
    const rounded = Math.round(count * 2) / 2;
    return `${rounded} ملعقة صغيرة`;
}

let baseIngredients = [];
let baseSpices = [];

function parseTriples(raw) {
    const parts = (raw || "").split("|").map(x => x.trim()).filter(Boolean);
    const result = [];
    for (let i = 0; i < parts.length; i += 3) {
        const name = parts[i];
        const qty = Number(parts[i + 1]);
        const unit = parts[i + 2];
        if (name && !Number.isNaN(qty) && unit) {
            result.push({ name, qty, unit });
        }
    }
    return result;
}

const servBtns = document.querySelectorAll(".serv-btn");

function setActiveServBtn(mult) {
    servBtns.forEach(b => b.classList.remove("active"));
    const btn = [...servBtns].find(b => Number(b.dataset.multiplier) === mult);
    if (btn) btn.classList.add("active");
}

servBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const mult = Number(btn.dataset.multiplier) || 1;
        setActiveServBtn(mult);
        renderList("modalIngredients", baseIngredients, mult);
        renderList("modalSpices", baseSpices, mult);
    });
});

function renderList(targetId, items, multiplier) {
    const box = document.getElementById(targetId);
    if (!box) return;
    box.innerHTML = "";
    items.forEach(item => {
        const span = document.createElement("span");
        const value = item.qty * multiplier;
        const nice = Number.isInteger(value) ? value : Number(value.toFixed(2));
        let extraText = "";
        if (item.unit === "غ" || item.unit === "مل") {
            const spoon = spoonsSmallText(nice, item.name);
            if (spoon) {
                extraText = ` (${spoon})`;
            } else {
                if (!isNoCupItem(item.name)) {
                    extraText = ` (${formatCups(gramsToCups(nice))} كوب)`;
                }
            }
        }
        span.textContent = `${item.name} ${nice} ${item.unit}${extraText}`;
        box.appendChild(span);
    });
}

window.openRecipeFromData = function (btn) {
    const card = btn.closest(".foods-card");
    const region = card?.getAttribute("data-region") || "";

    const servingsBox = document.querySelector(".servings-box");
    if (servingsBox) servingsBox.style.display = (region === "main-foods") ? "flex" : "none";

    const title = btn.dataset.title || "وصفة";
    const img = btn.dataset.img || "";

    const titleEl = document.getElementById("modalTitle");
    const imgEl = document.getElementById("modalImg");

    if (titleEl) titleEl.textContent = title;
    if (imgEl) {
        imgEl.src = img;
        imgEl.alt = title;
        imgEl.style.display = img ? "block" : "none";
    }

    const ingredientsRaw = btn.dataset.ingredients || "";
    const spicesRaw = btn.dataset.spices || "";
    const saucesRaw = btn.dataset.sauces || "";
    const stepsRaw = btn.dataset.steps || "";

    baseIngredients = parseTriples(ingredientsRaw);
    baseSpices = parseTriples(spicesRaw);

    setActiveServBtn(1);
    renderList("modalIngredients", baseIngredients, 1);
    renderList("modalSpices", baseSpices, 1);

    const sauces = saucesRaw.split("|").map(x => x.trim()).filter(Boolean);
    const saucesBox = document.getElementById("modalSauces");
    const saucesTitle = document.getElementById("saucesTitle");

    if (saucesBox) {
        saucesBox.innerHTML = "";
        sauces.forEach(s => {
            const span = document.createElement("span");
            span.textContent = s;
            saucesBox.appendChild(span);
        });
        if (saucesTitle) saucesTitle.style.display = sauces.length ? "block" : "none";
        saucesBox.style.display = sauces.length ? "flex" : "none";
    }

    const spicesBox = document.getElementById("modalSpices");
    const spicesTitle = spicesBox?.previousElementSibling;
    if (baseSpices.length === 0) {
        if (spicesTitle) spicesTitle.style.display = "none";
        if (spicesBox) spicesBox.style.display = "none";
    } else {
        if (spicesTitle) spicesTitle.style.display = "block";
        if (spicesBox) spicesBox.style.display = "flex";
    }

    const stepsBox = document.getElementById("modalSteps");
    if (stepsBox) {
        stepsBox.innerHTML = "";
        stepsRaw.split("|").map(x => x.trim()).filter(Boolean).forEach(st => {
            const li = document.createElement("li");
            li.textContent = st;
            stepsBox.appendChild(li);
        });
    }

    openModal();
};

document.addEventListener("DOMContentLoaded", () => {
    // فتح الوصفة من URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("recipe");
    if (recipeId) {
        const card = document.getElementById(recipeId);
        if (card) {
            card.style.display = "block";
            const btn = card.querySelector(".recipes-item");
            if (btn) {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                btn.click();
            }
        }
    }

    // فتح المدينة من URL
    const cityId = params.get("city");
    if (cityId) {
        const cites = document.querySelectorAll(".cite");
        cites.forEach(cite => {
            const saveBtn = cite.querySelector(".save-btn");
            const onclickAttr = saveBtn?.getAttribute("onclick") || "";
            if (onclickAttr.includes(cityId)) {
                openCityModal(cite);
                cite.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }
});

// --- حفظ آخر فلتر قارة ---
document.querySelectorAll('.filter-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        sessionStorage.setItem('lastContinent', btn.getAttribute('data-filter'));
    });
});

// --- استرجاع آخر فلتر قارة عند تحميل الصفحة ---
document.addEventListener('DOMContentLoaded', () => {
    const lastContinent = sessionStorage.getItem('lastContinent');
    if (lastContinent) {
        const btn = document.querySelector(`.filter-buttons button[data-filter="${lastContinent}"]`);
        if (btn) {
            btn.click();
            const section = document.getElementById(lastContinent);
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});


// ── تطبيق حالة الدول (3 حالات) — يقرأ من /country-states ───────────────────
(async function applyCountryStatuses() {
    if (!document.querySelector('.country-card')) return;

    const SOON    = 'https://res.cloudinary.com/dqe6mmkzz/image/upload/v1792593486/soon.png';
    const UPGRADE = 'https://res.cloudinary.com/dqe6mmkzz/image/upload/v1793163185/Upgrade.jpg';
    const API     = 'https://sofrh-1.onrender.com';

    try {
        const res = await fetch(`${API}/country-states`);
        const statuses = res.ok ? await res.json() : {};

        const planRes  = await fetch('/plan/plan.js');
        const planText = await planRes.text();
        const arrMatch = planText.match(/const\s+countries\s*=\s*(\[[\s\S]*?\]);/);
        const planCountries = arrMatch ? JSON.parse(arrMatch[1]) : [];
        const CDN = 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/';
        const origImg = {};
        planCountries.forEach(c => {
            if (c.img) origImg[c.id] = CDN + c.img.replace('/img/', '');
        });

        document.querySelectorAll('.country-card').forEach(card => {
            const onclick = card.getAttribute('onclick') || '';
            const idMatch = onclick.match(/\/([^/]+)\.html/);
            if (!idMatch) return;
            const cid    = idMatch[1];
            const status = statuses[cid] || (card.classList.contains('coming-soon') ? 'coming_soon' : 'active');
            const img    = card.querySelector('img');

            if (status === 'coming_soon') {
                card.classList.add('coming-soon');
                card.classList.remove('in-development');
                card.style.pointerEvents = 'none';
                if (img) img.src = SOON;

            } else if (status === 'in_development') {
                card.classList.add('in-development');
                card.classList.remove('coming-soon');
                card.style.pointerEvents = 'none';
                if (img) img.src = UPGRADE;

            } else {
                card.classList.remove('coming-soon', 'in-development');
                card.style.pointerEvents = '';
                if (img && origImg[cid]) img.src = origImg[cid];
            }
        });

    } catch (_) { /* silent fail */ }
})();

