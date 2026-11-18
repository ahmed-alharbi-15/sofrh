// خريطة الدول
const countryContinent = {
    saudi: 'asia', uae: 'asia', qatar: 'asia', kuwait: 'asia', bahrain: 'asia', oman: 'asia',
    jordan: 'asia', lebanon: 'asia', syria: 'asia', iraq: 'asia', yemen: 'asia', palestine: 'asia', israel: 'asia',
    turkey: 'asia', iran: 'asia', armenia: 'asia', azerbaijan: 'asia', georgia: 'asia',
    india: 'asia', pakistan: 'asia', bangladesh: 'asia', srilanka: 'asia', maldives: 'asia', nepal: 'asia', bhutan: 'asia', afghanistan: 'asia',
    china: 'asia', japan: 'asia', korea: 'asia', north_korea: 'asia', taiwan: 'asia', mongolia: 'asia', hongkong: 'asia', macau: 'asia',
    vietnam: 'asia', thailand: 'asia', malaysia: 'asia', indonesia: 'asia', philippines: 'asia', singapore: 'asia', cambodia: 'asia', myanmar: 'asia', laos: 'asia', brunei: 'asia', timor_leste: 'asia',
    kazakhstan: 'asia', uzbekistan: 'asia', turkmenistan: 'asia', kyrgyzstan: 'asia', tajikistan: 'asia',
    france: 'europe', germany: 'europe', italy: 'europe', spain: 'europe', portugal: 'europe', uk: 'europe', ireland: 'europe', netherlands: 'europe',
    belgium: 'europe', luxembourg: 'europe', switzerland: 'europe', austria: 'europe', liechtenstein: 'europe', monaco: 'europe', andorra: 'europe',
    sweden: 'europe', norway: 'europe', denmark: 'europe', finland: 'europe', iceland: 'europe', estonia: 'europe', latvia: 'europe', lithuania: 'europe',
    greece: 'europe', croatia: 'europe', kosovo: 'europe', slovenia: 'europe', serbia: 'europe', bosnia: 'europe', montenegro: 'europe', albania: 'europe', north_macedonia: 'europe', northmacedonia: 'europe', malta: 'europe', cyprus: 'europe', san_marino: 'europe', sanmarino: 'europe', vatican: 'europe', vaticancity: 'europe',
    poland: 'europe', czechia: 'europe', czechrepublic: 'europe', slovakia: 'europe', hungary: 'europe', romania: 'europe', bulgaria: 'europe', moldova: 'europe', ukraine: 'europe', belarus: 'europe', russia: 'europe',
    egypt: 'africa', moroco: 'africa', tunisia: 'africa', algeria: 'africa', libya: 'africa', sudan: 'africa', mauritania: 'africa',
    ethiopia: 'africa', kenya: 'africa', tanzania: 'africa', uganda: 'africa', rwanda: 'africa', burundi: 'africa', somalia: 'africa', djibouti: 'africa', eritrea: 'africa', south_sudan: 'africa', madagascar: 'africa', mozambique: 'africa', zimbabwe: 'africa', zambia: 'africa', malawi: 'africa',
    nigeria: 'africa', ghana: 'africa', senegal: 'africa', ivory_coast: 'africa', mali: 'africa', burkina_faso: 'africa', niger: 'africa', guinea: 'africa', sierra_leone: 'africa', liberia: 'africa', togo: 'africa', benin: 'africa', gambia: 'africa', guinea_bissau: 'africa', cape_verde: 'africa',
    cameroon: 'africa', chad: 'africa', car: 'africa', congo: 'africa', drc: 'africa', gabon: 'africa', equatorial_guinea: 'africa', seychelles: 'africa',
    southafrica: 'africa', namibia: 'africa', botswana: 'africa', lesotho: 'africa', swaziland: 'africa', angola: 'africa', mauritius: 'africa', comoros: 'africa',
    usa: 'north-america', canada: 'north-america', mexico: 'north-america', cuba: 'north-america', jamaica: 'north-america', haiti: 'north-america',
    dominican_republic: 'north-america', puerto_rico: 'north-america', costa_rica: 'north-america', costarica: 'north-america', panama: 'north-america', guatemala: 'north-america',
    honduras: 'north-america', el_salvador: 'north-america', elsalvador: 'north-america', nicaragua: 'north-america', belize: 'north-america', trinidad: 'north-america', bahamas: 'north-america', barbados: 'north-america', antiguabarbuda: 'north-america', dominica: 'north-america', dominican: 'north-america', grenada: 'north-america', stkittsnevis: 'north-america', stlucia: 'north-america', stvincentgrenadines: 'north-america',
    brazil: 'south-america', argentina: 'south-america', colombia: 'south-america', peru: 'south-america', chile: 'south-america', venezuela: 'south-america',
    ecuador: 'south-america', bolivia: 'south-america', uruguay: 'south-america', paraguay: 'south-america', guyana: 'south-america', suriname: 'south-america',
    australia: 'oceania', newzealand: 'oceania', fiji: 'oceania', papuanewguinea: 'oceania', solomonislands: 'oceania', vanuatu: 'oceania', samoa: 'oceania', tonga: 'oceania', kiribati: 'oceania', tuvalu: 'oceania', nauru: 'oceania', palau: 'oceania', micronesia: 'oceania', marshallislands: 'oceania',
    'sri-lanka': 'asia',
};

const currentUser = JSON.parse(localStorage.getItem("safraUser"));
if (!currentUser) {
    window.location.href = "/auth/login.html";
} else {
    document.getElementById("profileName").textContent = currentUser.name;
    document.getElementById("profileEmail").textContent = currentUser.email;
    const savedAvatar = localStorage.getItem("safraAvatar");
    const avatarSrc = currentUser.avatar || savedAvatar || null;
    if (avatarSrc) {
        document.getElementById("profileAvatar").src = avatarSrc;
        const navAvatar = document.getElementById("userAvatar");
        if (navAvatar) navAvatar.src = avatarSrc;
    }
    if (document.getElementById("settingsName")) document.getElementById("settingsName").value = currentUser.name || "";
    if (document.getElementById("settingsEmail")) document.getElementById("settingsEmail").value = currentUser.email || "";
    if (document.getElementById("settingsPhone")) document.getElementById("settingsPhone").value = currentUser.phone || "";
}

// تغيير الصورة
const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
    avatarInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            document.getElementById("profileAvatar").src = base64;
            const navAvatar = document.getElementById("userAvatar");
            if (navAvatar) navAvatar.src = base64;
            localStorage.setItem("safraAvatar", base64);
            const user = JSON.parse(localStorage.getItem("safraUser"));
            user.avatar = base64;
            localStorage.setItem("safraUser", JSON.stringify(user));
        };
        reader.readAsDataURL(file);

        const user = JSON.parse(localStorage.getItem("safraUser"));
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(`https://sofrh-1.onrender.com/upload-avatar?username=${user.name}`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                user.avatar = data.url;
                localStorage.setItem("safraUser", JSON.stringify(user));
                localStorage.setItem("safraAvatar", data.url);
                showToast("تم حفظ الصورة بنجاح ✨", "success");
            } else {
                showToast("تم الحفظ محلياً فقط", "info");
            }
        } catch (error) {
            showToast("تم الحفظ محلياً فقط", "info");
        }
    });
}

// التنقل بين الأقسام
document.querySelectorAll(".profile-nav a, .profile-mobile-nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".profile-nav a, .profile-mobile-nav a").forEach(a => a.classList.remove("active"));
        document.querySelectorAll(".fav-section").forEach(s => s.classList.remove("active"));
        link.classList.add("active");
        const section = link.getAttribute("data-section");
        document.getElementById(`section-${section}`).classList.add("active");
    });
});

function getCountryLink(id) {
    const continent = countryContinent[id] || 'asia';
    return `https://sofrh.vercel.app/countries/country/${continent}/${id}.html`;
}

const typeLinks = {
    event: (item) => `/events/events.html?event=${item.id}`,
    recipe: (item) => `/recipes/recipes.html?recipe=${item.id}`,
    country: (item) => getCountryLink(item.id),
    city: (item) => {
        const countryId = item.id.split('_')[0];
        return getCountryLink(countryId) + `?city=${item.id}`;
    },
    // planId = id الدولة + تاريخ الحفظ (YYYY-MM-DD) — نشيل التاريخ ونرجع لصفحة الدولة
    plan: (item) => getCountryLink(item.id.replace(/-\d{4}-\d{2}-\d{2}$/, '')),
};

const _recipeCountry = {
    saleeg:'السعودية',kabsa:'السعودية',jareesh:'السعودية',madfoon:'السعودية',areeka:'السعودية',kleeja:'السعودية',
    majboos:'الكويت',harees:'الكويت',threed:'قطر',luqaimat:'الكويت',margoug:'الكويت',tashreeb:'الكويت','zubaidi-fish':'الكويت',
    sushi:'اليابان',ramen:'اليابان',tempura:'اليابان',okonomiyaki:'اليابان',takoyaki:'اليابان',tonkatsu:'اليابان',
    'nasi-goreng':'إندونيسيا','mie-goreng':'إندونيسيا',rendang:'إندونيسيا','gado-gado':'إندونيسيا','dadar-gulung':'إندونيسيا',satay:'إندونيسيا',
    hoawshi:'مصر',kushari:'مصر',tameya:'مصر',mahshi:'مصر',molokhia:'مصر',kofta:'مصر',
    bobotie:'جنوب أفريقيا',braai:'جنوب أفريقيا','pap-chakalaka':'جنوب أفريقيا','bunny-chow':'جنوب أفريقيا',sosatie:'جنوب أفريقيا','milk-tart':'جنوب أفريقيا',
    shebakia:'المغرب',tajine:'المغرب',couscous:'المغرب',bastilla:'المغرب',harira:'المغرب',msemen:'المغرب','bissara':'المغرب',zaalouk:'المغرب',
    'neapolitan-pizza':'إيطاليا',carbonara:'إيطاليا',lasagna:'إيطاليا',risotto:'إيطاليا','penne-arrabbiata':'إيطاليا','chicken-parmigiana':'إيطاليا',
    fondue:'سويسرا',raclette:'سويسرا','swiss-chocolate':'سويسرا',rosti:'سويسرا','bircher-muesli':'سويسرا','zurcher-geschnetzeltes':'سويسرا',
    hangikjot:'آيسلندا',vinarterta:'آيسلندا',plokkfiskur:'آيسلندا','seafood-soup':'آيسلندا',ponnukokur:'آيسلندا','skyr-cheesecake':'آيسلندا',
    'bandeja-paisa':'كولومبيا',arepa:'كولومبيا',sancocho:'كولومبيا',empanadas:'كولومبيا',patacones:'كولومبيا',ajiaco:'كولومبيا',
    feijoada:'البرازيل',churrasco:'البرازيل','pao-de-queijo':'البرازيل',moqueca:'البرازيل',acaraje:'البرازيل',pudim:'البرازيل',
    ceviche:'بيرو','lomo-saltado':'بيرو','aji-de-gallina':'بيرو','papa-huancaina':'بيرو',anticuchos:'بيرو',picarones:'بيرو','causa-rellena':'بيرو','leche-de-tigre':'بيرو',
    tacos:'المكسيك',burrito:'المكسيك',quesadilla:'المكسيك',enchilada:'المكسيك',guacamole:'المكسيك',churros:'المكسيك',pozole:'المكسيك',tamales:'المكسيك',mole:'المكسيك',
    burger:'الولايات المتحدة','american-pizza':'الولايات المتحدة','hot-dog':'الولايات المتحدة','fried-chicken':'الولايات المتحدة',pancakes:'الولايات المتحدة',donuts:'الولايات المتحدة',
    poutine:'كندا','maple-pancakes':'كندا','smoked-meat':'كندا',tourtiere:'كندا','lobster-canada':'كندا',beavertails:'كندا',
    'peking-duck':'الصين',dumplings:'الصين','chinese-noodles':'الصين','fried-rice':'الصين','dim-sum':'الصين','kung-pao-chicken':'الصين',
    biryani:'كينيا','butter-chicken':'الهند',samosa:'كينيا',naan:'الهند','masala-dosa':'الهند','gulab-jamun':'الهند',
    'pad-thai':'تايلاند','tom-yum':'تايلاند','mango-sticky-rice':'تايلاند','green-curry':'تايلاند','thai-fried-rice':'تايلاند',
    'nasi-lemak':'ماليزيا','malaysia-satay':'ماليزيا','roti-canai':'ماليزيا',laksa:'ماليزيا',
    'chicken-rice':'سنغافورة','chilli-crab':'سنغافورة','singapore-laksa':'سنغافورة','singapore-satay':'سنغافورة','kaya-toast':'سنغافورة','ice-kachang':'سنغافورة',
    adobo:'الفلبين',sinigang:'الفلبين',sisig:'الفلبين',pancit:'الفلبين','halo-halo':'الفلبين',lumpia:'الفلبين',
    'pho-chicken':'فيتنام','banh-mi':'فيتنام','spring-rolls':'فيتنام','com-ga':'فيتنام','bun-tom':'فيتنام','che-chuoi':'فيتنام',
    'grilled-fish-uae':'المالديف',khabees:'الإمارات',balaleet:'قطر',
    'iskender-kebab':'تركيا',manti:'تركيا',doner:'تركيا',pide:'تركيا',borek:'تركيا','turkish-kunafa':'تركيا',
    garudhiya:'المالديف','mas-huni':'المالديف',rihaakuru:'المالديف','seafood-rice':'المالديف','coconut-pudding':'المالديف',
    'kottu-roti':'سريلانكا','sri-lankan-biryani':'سريلانكا',hoppers:'سريلانكا','fish-curry':'سريلانكا',watalappam:'سريلانكا',
    brik:'تونس',lablabi:'تونس','tunisian-grills':'تونس','tunisian-tajine':'تونس',makroudh:'تونس',
    pilau:'كينيا','nyama-choma':'كينيا',chapati:'كينيا',mandazi:'كينيا',
    'pilau-rice':'تنزانيا',mishkaki:'تنزانيا',ugali:'تنزانيا','grilled-fish-tz':'تنزانيا','samosa-tz':'تنزانيا','mandazi-tz':'تنزانيا',
    paella:'إسبانيا',gazpacho:'إسبانيا',tortilla:'إسبانيا',churros_esp:'إسبانيا',croquetas:'إسبانيا',
    croissant:'فرنسا',ratatouille:'فرنسا','coq-au-vin':'فرنسا',crepes:'فرنسا','french-onion-soup':'فرنسا',
    moussaka:'اليونان',souvlaki:'اليونان',tzatziki:'اليونان',spanakopita:'اليونان',baklava:'اليونان',
    hummus:'لبنان',tabbouleh:'لبنان',kibbeh:'لبنان',fattoush:'لبنان',manakish:'لبنان',
    'ghormeh-sabzi':'إيران','fesenjan':'إيران','ash-reshteh':'إيران','tahdig':'إيران','chelo-kabab':'إيران',
    'nihari':'باكستان',haleem:'باكستان','chapli-kebab':'باكستان','karahi':'باكستان','biryani-pk':'باكستان',
    bibimbap:'كوريا الجنوبية',kimchi:'كوريا الجنوبية',bulgogi:'كوريا الجنوبية',tteokbokki:'كوريا الجنوبية',ramyeon:'كوريا الجنوبية',jajangmyeon:'كوريا الجنوبية',
    injera:'إثيوبيا',tibs:'إثيوبيا','doro-wat':'إثيوبيا',
    'jollof-rice':'نيجيريا',egusi:'نيجيريا',suya:'نيجيريا',
    'asado':'الأرجنتين','empanadas-arg':'الأرجنتين','dulce-de-leche':'الأرجنتين',
    borscht:'روسيا',pelmeni:'روسيا',stroganoff:'روسيا',
    schnitzel:'ألمانيا',bratwurst:'ألمانيا',pretzel:'ألمانيا',
    'chakchouka':'الجزائر','rechta':'الجزائر',
    asida:'ليبيا',sharba:'ليبيا',
    'ful-sudani':'السودان',kisra:'السودان',
    saltah:'اليمن',fahsa:'اليمن',mandi:'اليمن',
    quzi:'العراق',dolma:'العراق',masgouf:'العراق',
    'kibbeh-sy':'سوريا',muhamara:'سوريا','fattet-hummus':'سوريا',
    mansaf:'الأردن',maqluba:'الأردن',
    musakhan:'فلسطين','knafeh':'فلسطين',
};

async function renderFavorites() {
    const user = JSON.parse(localStorage.getItem("safraUser"));
    if (!user) return;

    let saved = {};
    try {
        const response = await fetch(`https://sofrh-1.onrender.com/favorites/${user.email}`);
        const data = await response.json();
        saved = data.favorites || {};
    } catch (err) {
        saved = JSON.parse(localStorage.getItem("safraFavorites") || "{}");
    }

    const hiddenNames = new Set();
    const eventCountryMap = {};
    try {
        const [statusRes, planRes, evRes] = await Promise.all([
            fetch('https://sofrh-1.onrender.com/countries/status'),
            fetch('/plan/plan.js'),
            fetch('/events/events.html')
        ]);
        const statusList = statusRes.ok ? await statusRes.json() : [];
        const planText = planRes.ok ? await planRes.text() : '';
        const arrMatch = planText.match(/const\s+countries\s*=\s*(\[[\s\S]*?\]);/);
        const planCountries = arrMatch ? JSON.parse(arrMatch[1]) : [];
        const hiddenIds = new Set(statusList.filter(s => s.status !== 'active').map(s => s.id));
        planCountries.filter(pc => hiddenIds.has(pc.id)).forEach(pc => hiddenNames.add(pc.nameAr));
        if (evRes.ok) {
            const evHtml = await evRes.text();
            const evDoc = new DOMParser().parseFromString(evHtml, 'text/html');
            evDoc.querySelectorAll('.event-card').forEach(card => {
                const btn = card.querySelector('.event-item');
                const country = btn?.getAttribute('data-country') || '';
                if (card.id && country) eventCountryMap[card.id] = country;
            });
        }
    } catch (_) {}

    function isHiddenItem(key, item) {
        if (!hiddenNames.size) return false;
        if (key === 'recipe') {
            const country = _recipeCountry[item.id] || '';
            return country ? hiddenNames.has(country) : false;
        }
        if (key === 'event') {
            const country = eventCountryMap[item.id] || '';
            return country ? [...hiddenNames].some(n => country.includes(n)) : false;
        }
        return false;
    }

    const types = [
        { key: "plan", gridId: "favPlans", emptyId: "emptyPlans" },
        { key: "country", gridId: "favCountries", emptyId: "emptyCountries" },
        { key: "city", gridId: "favCities", emptyId: "emptyCity" },
        { key: "event", gridId: "favEvents", emptyId: "emptyEvents" },
        { key: "recipe", gridId: "favRecipes", emptyId: "emptyRecipes" },
    ];

    types.forEach(({ key, gridId, emptyId }) => {
        const grid = document.getElementById(gridId);
        const empty = document.getElementById(emptyId);
        if (!grid) return;
        const items = saved[key] || [];
        grid.innerHTML = "";
        if (items.length === 0) { empty.style.display = "block"; return; }
        empty.style.display = "none";
        items.forEach(item => {
            const hidden = isHiddenItem(key, item);
            const card = document.createElement("div");
            card.className = key === "plan" ? "fav-card fav-card-plan" : "fav-card";
            if (hidden) { card.style.opacity = '0.5'; card.style.cursor = 'default'; }
            const link = typeLinks[key] ? typeLinks[key](item) : '#';

            let infoHtml = `<span>${item.name}</span>`;
            if (key === "plan") {
                const [countryName, budget, days] = item.name.split(" – ");
                infoHtml = `
                    <span class="plan-country">${countryName || item.name}</span>
                    ${budget ? `<span class="plan-meta">💰 ${budget}</span>` : ""}
                    ${days ? `<span class="plan-meta">📅 ${days}</span>` : ""}`;
            } else if (hidden) {
                infoHtml = `<span>${item.name}</span><span style="font-size:0.65rem;background:#d2a673;color:#fff;padding:2px 6px;border-radius:8px;margin-inline-start:6px">قريباً</span>`;
            }

            card.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="fav-card-info">
                    <div class="fav-card-text">${infoHtml}</div>
                    <button class="fav-remove" data-type="${key}" data-id="${item.id}" title="حذف">🗑️</button>
                </div>
            `;
            card.addEventListener("click", (e) => {
                if (e.target.closest(".fav-remove")) return;
                if (hidden) {
                    if (typeof showToast === 'function') showToast('هذا المحتوى غير متاح حالياً', 'info');
                    return;
                }
                window.location.href = link;
            });
            card.querySelector(".fav-remove").addEventListener("click", (e) => {
                e.stopPropagation();
                showConfirm(`هل تريد إزالة "${item.name}" من المفضلة؟`, () => removeItem(key, item.id));
            });
            grid.appendChild(card);
        });
    });
}

// حذف من المفضلة
async function removeItem(type, id) {
    const user = JSON.parse(localStorage.getItem("safraUser"));
    if (!user) return;
    try {
        await fetch('https://sofrh-1.onrender.com/favorites/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, type, id })
        });
    } catch (err) {
        showToast("فشل الحذف", "error");
    }
    renderFavorites();
}

// حفظ المعلومات الشخصية
const settingsForm = document.getElementById("settingsForm");
if (settingsForm) {
    settingsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("settingsName").value;
        const email = document.getElementById("settingsEmail").value;
        const phone = document.getElementById("settingsPhone").value;
        try {
            const response = await fetch("https://sofrh-1.onrender.com/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone })
            });
            const data = await response.json();
            if (response.ok) {
                const user = JSON.parse(localStorage.getItem("safraUser"));
                user.name = name; user.email = email; user.phone = phone;
                localStorage.setItem("safraUser", JSON.stringify(user));
                document.getElementById("profileName").textContent = name;
                document.getElementById("profileEmail").textContent = email;
                showToast("تم حفظ التغييرات ✨", "success");
            } else showToast("خطأ: " + data.detail, "error");
        } catch (err) { showToast("السيرفر طافي!", "error"); }
    });
}

// تغيير كلمة المرور
const changePasswordBtn = document.getElementById("changePasswordBtn");
if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", async () => {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const user = JSON.parse(localStorage.getItem("safraUser"));
        if (newPassword !== confirmPassword) { showToast("كلمة المرور الجديدة مو متطابقة!", "error"); return; }
        try {
            const response = await fetch("https://sofrh-1.onrender.com/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword, email: user.email })
            });
            const data = await response.json();
            if (response.ok) {
                showToast("تم تغيير كلمة المرور ✨", "success");
                document.getElementById("currentPassword").value = "";
                document.getElementById("newPassword").value = "";
                document.getElementById("confirmPassword").value = "";
            } else showToast("خطأ: " + data.detail, "error");
        } catch (err) { showToast("السيرفر طافي!", "error"); }
    });
}

renderFavorites();