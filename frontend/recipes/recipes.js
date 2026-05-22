const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-buttons button");
const cards = document.querySelectorAll(".foods-card");

let activeFilter = "all";

function applySearchAndFilter() {
    const query = (searchInput?.value || "").toLowerCase().trim();
    cards.forEach((card) => {
        const name = (card.querySelector(".recipes-head span")?.textContent || "").toLowerCase();
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

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && recipeModal?.style.display === "block") closeModal();
});

function gramsToCups(value) { return value / 250; }
function formatCups(value) {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

const noCupsFor = [
    "لحم","دجاج","سمك","سلمون","تونة","روبيان","جمبري","فيليه","ستيك","مفروم","كبدة",
    "بصل","ثوم","طماطم","بطاطس","جزر","كوسة","باذنجان","فلفل","خيار","خس","سبانخ",
    "بروكلي","قرنبيط","فطر","فاصوليا","بازلاء","ملفوف","ذرة","كرفس","شمندر","جرجير",
    "تفاح","موز","برتقال","فراولة","عنب","مانجا","أناناس","رمان","كيوي","تمر","تين",
    "خوخ","كمثرى","بطيخ","شمام","ليمون","نودلز","بيض","فطر","فول","بسكوت","عدس","حلبة","لوز","بلح","حبار","كزبرة","بط","سلطعون","ثلج","شعيرية"
];

function isNoCupItem(name = "") {
    return noCupsFor.some(word => name.includes(word));
}

const noSpoonsFor = ["فطر","بيض","بصل","ثوم","حلبة","كزبرة"];

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

// ======================================
// خريطة الدول - شاملة للمستقبل
// ======================================
const countryMap = {
    // السعودية
    saleeg:'السعودية', kabsa:'السعودية', jareesh:'السعودية', madfoon:'السعودية',
    areeka:'السعودية', kleeja:'السعودية', majboos:'السعودية', harees:'السعودية',
    threed:'السعودية', luqaimat:'السعودية',
    // اليابان
    sushi:'اليابان', ramen:'اليابان', tempura:'اليابان',
    okonomiyaki:'اليابان', takoyaki:'اليابان', tonkatsu:'اليابان',
    // إندونيسيا
    'nasi-goreng':'إندونيسيا', 'mie-goreng':'إندونيسيا', rendang:'إندونيسيا',
    'gado-gado':'إندونيسيا', 'dadar-gulung':'إندونيسيا', satay:'إندونيسيا',
    // مصر
    hoawshi:'مصر', kushari:'مصر', tameya:'مصر',
    mahshi:'مصر', molokhia:'مصر', kofta:'مصر',
    // جنوب أفريقيا
    bobotie:'جنوب أفريقيا', braai:'جنوب أفريقيا', 'pap-chakalaka':'جنوب أفريقيا',
    'bunny-chow':'جنوب أفريقيا', sosatie:'جنوب أفريقيا', 'milk-tart':'جنوب أفريقيا',
    // المغرب
    shebakia:'المغرب', tajine:'المغرب', couscous:'المغرب',
    bastilla:'المغرب', harira:'المغرب', msemen:'المغرب',
    // إيطاليا
    'neapolitan-pizza':'إيطاليا', carbonara:'إيطاليا', lasagna:'إيطاليا',
    risotto:'إيطاليا', 'penne-arrabbiata':'إيطاليا', 'chicken-parmigiana':'إيطاليا',
    // سويسرا
    fondue:'سويسرا', raclette:'سويسرا', 'swiss-chocolate':'سويسرا',
    rosti:'سويسرا', 'bircher-muesli':'سويسرا', 'zurcher-geschnetzeltes':'سويسرا',
    // آيسلندا
    hangikjot:'آيسلندا', vinarterta:'آيسلندا', plokkfiskur:'آيسلندا',
    'seafood-soup':'آيسلندا', ponnukokur:'آيسلندا', 'skyr-cheesecake':'آيسلندا',
    // كولومبيا
    'bandeja-paisa':'كولومبيا', arepa:'كولومبيا', sancocho:'كولومبيا',
    empanadas:'كولومبيا', patacones:'كولومبيا', ajiaco:'كولومبيا',
    // البرازيل
    feijoada:'البرازيل', churrasco:'البرازيل', 'pao-de-queijo':'البرازيل',
    moqueca:'البرازيل', acaraje:'البرازيل', pudim:'البرازيل',
    // بيرو
    ceviche:'بيرو', 'lomo-saltado':'بيرو', 'aji-de-gallina':'بيرو',
    'papa-huancaina':'بيرو', anticuchos:'بيرو', picarones:'بيرو',
    // المكسيك
    tacos:'المكسيك', burrito:'المكسيك', quesadilla:'المكسيك',
    enchilada:'المكسيك', guacamole:'المكسيك', churros:'المكسيك',
    // أمريكا
    burger:'أمريكا', 'american-pizza':'أمريكا', 'hot-dog':'أمريكا',
    'fried-chicken':'أمريكا', pancakes:'أمريكا', donuts:'أمريكا',
    // كندا
    poutine:'كندا', 'maple-pancakes':'كندا', 'smoked-meat':'كندا',
    tourtiere:'كندا', 'lobster-canada':'كندا', beavertails:'كندا',
    // الصين
    'peking-duck':'الصين', dumplings:'الصين', 'chinese-noodles':'الصين',
    'fried-rice':'الصين', 'dim-sum':'الصين', 'kung-pao-chicken':'الصين',
    // الهند
    biryani:'الهند', 'butter-chicken':'الهند', samosa:'الهند',
    naan:'الهند', 'masala-dosa':'الهند', 'gulab-jamun':'الهند',
    // تايلاند
    'pad-thai':'تايلاند', 'tom-yum':'تايلاند', 'mango-sticky-rice':'تايلاند',
    'green-curry':'تايلاند', 'thai-fried-rice':'تايلاند',
    // ماليزيا
    'nasi-lemak':'ماليزيا', 'malaysia-satay':'ماليزيا', 'roti-canai':'ماليزيا',
    laksa:'ماليزيا', 'mee-goreng':'ماليزيا',
    // سنغافورة
    'chicken-rice':'سنغافورة', 'chilli-crab':'سنغافورة', 'singapore-laksa':'سنغافورة',
    'singapore-satay':'سنغافورة', 'kaya-toast':'سنغافورة', 'ice-kachang':'سنغافورة',
    // الفلبين
    adobo:'الفلبين', sinigang:'الفلبين', sisig:'الفلبين',
    pancit:'الفلبين', 'halo-halo':'الفلبين', lumpia:'الفلبين',
    // فيتنام
    'pho-chicken':'فيتنام', 'banh-mi':'فيتنام', 'spring-rolls':'فيتنام',
    'com-ga':'فيتنام', 'bun-tom':'فيتنام', 'che-chuoi':'فيتنام',
    // الإمارات
    'grilled-fish-uae':'الإمارات', khabees:'الإمارات', balaleet:'الإمارات',
    margoug:'الإمارات', tashreeb:'الإمارات',
    // الكويت
    'zubaidi-fish':'الكويت',
    // قطر
    // البحرين
    // عُمان
    // تركيا
    'iskender-kebab':'تركيا', manti:'تركيا', doner:'تركيا',
    pide:'تركيا', borek:'تركيا', 'turkish-kunafa':'تركيا',
    // المالديف
    garudhiya:'المالديف', 'mas-huni':'المالديف', rihaakuru:'المالديف',
    'seafood-rice':'المالديف', 'coconut-pudding':'المالديف',
    // سريلانكا
    'kottu-roti':'سريلانكا', 'sri-lankan-biryani':'سريلانكا', hoppers:'سريلانكا',
    'fish-curry':'سريلانكا', watalappam:'سريلانكا',
    // تونس
    brik:'تونس', lablabi:'تونس', 'tunisian-grills':'تونس',
    'tunisian-tajine':'تونس', makroudh:'تونس',
    // كينيا
    pilau:'كينيا', 'nyama-choma':'كينيا', chapati:'كينيا', mandazi:'كينيا',
    // تنزانيا
    'pilau-rice':'تنزانيا', mishkaki:'تنزانيا', ugali:'تنزانيا',
    'grilled-fish-tz':'تنزانيا', 'samosa-tz':'تنزانيا',
    // إسبانيا (للمستقبل)
    paella:'إسبانيا', gazpacho:'إسبانيا', tortilla:'إسبانيا',
    churros_esp:'إسبانيا', croquetas:'إسبانيا',
    // فرنسا
    croissant:'فرنسا', ratatouille:'فرنسا', 'coq-au-vin':'فرنسا',
    crepes:'فرنسا', 'french-onion-soup':'فرنسا',
    // اليونان
    moussaka:'اليونان', souvlaki:'اليونان', tzatziki:'اليونان',
    spanakopita:'اليونان', baklava:'اليونان',
    // لبنان
    hummus:'لبنان', tabbouleh:'لبنان', kibbeh:'لبنان',
    fattoush:'لبنان', manakish:'لبنان',
    // إيران
    'ghormeh-sabzi':'إيران', 'fesenjan':'إيران', 'ash-reshteh':'إيران',
    'tahdig':'إيران', 'chelo-kabab':'إيران',
    // باكستان
    'nihari':'باكستان', haleem:'باكستان', 'chapli-kebab':'باكستان',
    'karahi':'باكستان', 'biryani-pk':'باكستان',
    // كوريا
    'bibimbap':'كوريا', kimchi:'كوريا', 'bulgogi':'كوريا',
    'tteokbokki':'كوريا', 'japchae':'كوريا',
    // إثيوبيا
    injera:'إثيوبيا', tibs:'إثيوبيا', 'doro-wat':'إثيوبيا',
    // نيجيريا
    'jollof-rice':'نيجيريا', egusi:'نيجيريا', suya:'نيجيريا',
    // الأرجنتين
    'asado':'الأرجنتين', 'empanadas-arg':'الأرجنتين', 'dulce-de-leche':'الأرجنتين',
    // المكسيك (إضافي)
    pozole:'المكسيك', tamales:'المكسيك', mole:'المكسيك',
    // البيرو (إضافي)
    'causa-rellena':'بيرو', 'leche-de-tigre':'بيرو',
    // روسيا
    borscht:'روسيا', pelmeni:'روسيا', stroganoff:'روسيا',
    // ألمانيا
    schnitzel:'ألمانيا', bratwurst:'ألمانيا', pretzel:'ألمانيا',
    // المغرب (إضافي)
    'bissara':'المغرب', zaalouk:'المغرب',
    // الجزائر
    'chakchouka':'الجزائر', 'rechta':'الجزائر',
    // ليبيا
    asida:'ليبيا', sharba:'ليبيا',
    // السودان
    'ful-sudani':'السودان', kisra:'السودان',
    // اليمن
    saltah:'اليمن', fahsa:'اليمن', mandi:'اليمن',
    // العراق
    quzi:'العراق', dolma:'العراق', masgouf:'العراق',
    // سوريا
    'kibbeh-sy':'سوريا', muhamara:'سوريا', 'fattet-hummus':'سوريا',
    // الأردن
    mansaf:'الأردن', maqluba:'الأردن',
    // فلسطين
    musakhan:'فلسطين', 'knafeh':'فلسطين',
};

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

    // الدولة
    const country = card?.dataset.country || '';
    const countryEl = document.getElementById('modalCountry');
    if (countryEl) {
        countryEl.textContent = country ? '📍 ' + country : '';
        countryEl.style.display = country ? 'inline-block' : 'none';
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
    // تطبيق بادجات الدول على الكروت
    document.querySelectorAll('.foods-card[id]').forEach(card => {
        const country = countryMap[card.id];
        if (country) {
            card.dataset.country = country;
            const badge = card.querySelector('.country-badge');
            if (badge) badge.textContent = '📍 ' + country;
        }
    });

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

    // ترتيب الكروت أبجدياً
    const grid = document.querySelector('.foods-grid');
    if (grid) {
        const allCards = [...grid.querySelectorAll('.foods-card')];
        allCards.sort((a, b) => {
            const nameA = a.querySelector('.recipes-head span')?.textContent.trim() || '';
            const nameB = b.querySelector('.recipes-head span')?.textContent.trim() || '';
            return nameA.localeCompare(nameB, 'ar');
        });
        allCards.forEach(card => grid.appendChild(card));
    }
});