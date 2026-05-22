// القائمة الجانبية
var menuBtn = document.getElementById("menu-btn");
var sideMenu = document.getElementById("side-menu");
var closeBtn = document.getElementById("close-btn");
if (menuBtn && sideMenu && closeBtn) {
    menuBtn.addEventListener("click", () => { sideMenu.style.right = "0px"; });
    closeBtn.addEventListener("click", () => { sideMenu.style.right = "-260px"; });
    document.addEventListener("click", (e) => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.style.right = "-260px";
        }
    });
}

// التحقق من الجلسة
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("safraUser"));
    const authButtons = document.getElementById("authButtons");
    const userMenu = document.getElementById("userMenu");
    const userName = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");
    if (user) {
        if (authButtons) authButtons.style.display = "none";
        if (userMenu) userMenu.style.display = "flex";
        if (userName) userName.textContent = user.name;
        if (userAvatar && user.avatar) userAvatar.src = user.avatar;
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
    }
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("safraUser");
        window.location.href = "/index/index.html";
    });
}

checkAuth();

const currentUser = JSON.parse(localStorage.getItem("safraUser"));
if (!currentUser) {
    window.location.href = "/auth/login.html";
} else {
    document.getElementById("profileName").textContent = currentUser.name;
    document.getElementById("profileEmail").textContent = currentUser.email;
    if (currentUser.avatar) document.getElementById("profileAvatar").src = currentUser.avatar;
    if (document.getElementById("settingsName")) document.getElementById("settingsName").value = currentUser.name || "";
    if (document.getElementById("settingsEmail")) document.getElementById("settingsEmail").value = currentUser.email || "";
    if (document.getElementById("settingsPhone")) document.getElementById("settingsPhone").value = currentUser.phone || "";
}

const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
    avatarInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => { document.getElementById("profileAvatar").src = event.target.result; };
        reader.readAsDataURL(file);
        const user = JSON.parse(localStorage.getItem("safraUser"));
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(`https://sofrh-1.onrender.com/upload-avatar?username=${user.name}`, { method: "POST", body: formData });
            const data = await response.json();
            if (response.ok) {
                alert("✅ تم حفظ الصورة في السحاب بنجاح!");
                user.avatar = data.url;
                localStorage.setItem("safraUser", JSON.stringify(user));
            } else alert("⚠️ فشل الرفع: " + data.message);
        } catch (error) { alert("❌ حدث خطأ أثناء الاتصال بالسيرفر"); }
    });
}

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

// ======================================
// خريطة الدول لقاراتها - شاملة
// ======================================
const countryContinent = {
    // ==================== آسيا ====================
    // الخليج العربي
    saudi: 'asia', uae: 'asia', qatar: 'asia', kuwait: 'asia',
    bahrain: 'asia', oman: 'asia',
    // المشرق العربي
    jordan: 'asia', lebanon: 'asia', syria: 'asia', iraq: 'asia',
    yemen: 'asia', palestine: 'asia', israel: 'asia',
    // جنوب غرب آسيا
    turkey: 'asia', iran: 'asia', armenia: 'asia', azerbaijan: 'asia',
    georgia: 'asia', cyprus: 'asia',
    // جنوب آسيا
    india: 'asia', pakistan: 'asia', bangladesh: 'asia', srilanka: 'asia',
    maldives: 'asia', nepal: 'asia', bhutan: 'asia', afghanistan: 'asia',
    // شرق آسيا
    china: 'asia', japan: 'asia', korea: 'asia', north_korea: 'asia',
    taiwan: 'asia', mongolia: 'asia', hongkong: 'asia', macau: 'asia',
    // جنوب شرق آسيا
    vietnam: 'asia', thailand: 'asia', malaysia: 'asia', indonesia: 'asia',
    philippines: 'asia', singapore: 'asia', cambodia: 'asia', myanmar: 'asia',
    laos: 'asia', brunei: 'asia', timor_leste: 'asia',
    // وسط آسيا
    kazakhstan: 'asia', uzbekistan: 'asia', turkmenistan: 'asia',
    kyrgyzstan: 'asia', tajikistan: 'asia',

    // ==================== أوروبا ====================
    // أوروبا الغربية
    france: 'europe', germany: 'europe', italy: 'europe', spain: 'europe',
    portugal: 'europe', uk: 'europe', ireland: 'europe', netherlands: 'europe',
    belgium: 'europe', luxembourg: 'europe', switzerland: 'europe', austria: 'europe',
    liechtenstein: 'europe', monaco: 'europe', andorra: 'europe',
    // أوروبا الشمالية
    sweden: 'europe', norway: 'europe', denmark: 'europe', finland: 'europe',
    iceland: 'europe', estonia: 'europe', latvia: 'europe', lithuania: 'europe',
    // أوروبا الجنوبية
    greece: 'europe', croatia: 'europe', slovenia: 'europe', serbia: 'europe',
    bosnia: 'europe', montenegro: 'europe', albania: 'europe', north_macedonia: 'europe',
    malta: 'europe', san_marino: 'europe', vatican: 'europe',
    // أوروبا الشرقية
    poland: 'europe', czechia: 'europe', slovakia: 'europe', hungary: 'europe',
    romania: 'europe', bulgaria: 'europe', moldova: 'europe', ukraine: 'europe',
    belarus: 'europe', russia: 'europe',

    // ==================== أفريقيا ====================
    // شمال أفريقيا
    egypt: 'africa', morocco: 'africa', tunisia: 'africa', algeria: 'africa',
    libya: 'africa', sudan: 'africa', mauritania: 'africa',
    // أفريقيا جنوب الصحراء - شرق
    ethiopia: 'africa', kenya: 'africa', tanzania: 'africa', uganda: 'africa',
    rwanda: 'africa', burundi: 'africa', somalia: 'africa', djibouti: 'africa',
    eritrea: 'africa', south_sudan: 'africa', madagascar: 'africa',
    mozambique: 'africa', zimbabwe: 'africa', zambia: 'africa', malawi: 'africa',
    // أفريقيا الغربية
    nigeria: 'africa', ghana: 'africa', senegal: 'africa', ivory_coast: 'africa',
    mali: 'africa', burkina_faso: 'africa', niger: 'africa', guinea: 'africa',
    sierra_leone: 'africa', liberia: 'africa', togo: 'africa', benin: 'africa',
    gambia: 'africa', guinea_bissau: 'africa', cape_verde: 'africa',
    // أفريقيا الوسطى
    cameroon: 'africa', chad: 'africa', car: 'africa', congo: 'africa',
    drc: 'africa', gabon: 'africa', equatorial_guinea: 'africa',
    // أفريقيا الجنوبية
    southafrica: 'africa', namibia: 'africa', botswana: 'africa',
    lesotho: 'africa', swaziland: 'africa', angola: 'africa',

    // ==================== أمريكا الشمالية ====================
    usa: 'north-america', canada: 'north-america', mexico: 'north-america',
    cuba: 'north-america', jamaica: 'north-america', haiti: 'north-america',
    dominican_republic: 'north-america', puerto_rico: 'north-america',
    costa_rica: 'north-america', panama: 'north-america', guatemala: 'north-america',
    honduras: 'north-america', el_salvador: 'north-america', nicaragua: 'north-america',
    belize: 'north-america', trinidad: 'north-america', bahamas: 'north-america',
    barbados: 'north-america',

    // ==================== أمريكا الجنوبية ====================
    brazil: 'south-america', argentina: 'south-america', colombia: 'south-america',
    peru: 'south-america', chile: 'south-america', venezuela: 'south-america',
    ecuador: 'south-america', bolivia: 'south-america', uruguay: 'south-america',
    paraguay: 'south-america', guyana: 'south-america', suriname: 'south-america',

    // ==================== أوقيانوسيا ====================
    australia: 'oceania', newzealand: 'oceania', fiji: 'oceania',
    papua_new_guinea: 'oceania', solomon_islands: 'oceania', vanuatu: 'oceania',
    samoa: 'oceania', tonga: 'oceania', kiribati: 'oceania',
};

function getCountryLink(id) {
    const continent = countryContinent[id] || 'asia';
    return `/countries/country/${continent}/${id}.html`;
}

const typeLinks = {
    event:   (item) => `/events/events.html?event=${item.id}`,
    recipe:  (item) => `/recipes/recipes.html?recipe=${item.id}`,
    country: (item) => getCountryLink(item.id),
    city:    (item) => getCountryLink(item.id),
};

// عرض المفضلة
function renderFavorites() {
    const saved = JSON.parse(localStorage.getItem("safraFavorites") || "{}");
    const types = [
        { key: "event",   gridId: "favEvents",    emptyId: "emptyEvents" },
        { key: "recipe",  gridId: "favRecipes",   emptyId: "emptyRecipes" },
        { key: "country", gridId: "favCountries", emptyId: "emptyCountries" },
        { key: "city",    gridId: "favCities",    emptyId: "emptyCity" },
    ];

    types.forEach(({ key, gridId, emptyId }) => {
        const grid = document.getElementById(gridId);
        const empty = document.getElementById(emptyId);
        const items = saved[key] || [];
        grid.innerHTML = "";

        if (items.length === 0) {
            empty.style.display = "block";
            return;
        }
        empty.style.display = "none";

        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "fav-card";
            const link = typeLinks[key] ? typeLinks[key](item) : '#';
            card.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="fav-card-info">
                    <span>${item.name}</span>
                    <button class="fav-remove" data-type="${key}" data-id="${item.id}" title="حذف">🗑️</button>
                </div>
            `;
            card.addEventListener("click", (e) => {
                if (e.target.closest(".fav-remove")) return;
                window.location.href = link;
            });
            card.querySelector(".fav-remove").addEventListener("click", (e) => {
                e.stopPropagation();
                removeItem(key, item.id);
            });
            grid.appendChild(card);
        });
    });
}

function removeItem(type, id) {
    const saved = JSON.parse(localStorage.getItem("safraFavorites") || "{}");
    if (!saved[type]) return;
    saved[type] = saved[type].filter(item => item.id !== id);
    localStorage.setItem("safraFavorites", JSON.stringify(saved));
    renderFavorites();
}

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
                alert("✅ تم حفظ التغييرات!");
            } else alert("خطأ: " + data.detail);
        } catch (err) { alert("السيرفر طافي!"); }
    });
}

const changePasswordBtn = document.getElementById("changePasswordBtn");
if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", async () => {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const user = JSON.parse(localStorage.getItem("safraUser"));
        if (newPassword !== confirmPassword) { alert("كلمة المرور الجديدة مو متطابقة!"); return; }
        try {
            const response = await fetch("https://sofrh-1.onrender.com/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword, email: user.email })
            });
            const data = await response.json();
            if (response.ok) {
                alert("✅ تم تغيير كلمة المرور!");
                document.getElementById("currentPassword").value = "";
                document.getElementById("newPassword").value = "";
                document.getElementById("confirmPassword").value = "";
            } else alert("خطأ: " + data.detail);
        } catch (err) { alert("السيرفر طافي!"); }
    });
}

renderFavorites();