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
        localStorage.removeItem("safraAvatar");
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

// خريطة الدول
const countryContinent = {
    saudi: 'asia', uae: 'asia', qatar: 'asia', kuwait: 'asia', bahrain: 'asia', oman: 'asia',
    jordan: 'asia', lebanon: 'asia', syria: 'asia', iraq: 'asia', yemen: 'asia', palestine: 'asia', israel: 'asia',
    turkey: 'asia', iran: 'asia', armenia: 'asia', azerbaijan: 'asia', georgia: 'asia', cyprus: 'asia',
    india: 'asia', pakistan: 'asia', bangladesh: 'asia', srilanka: 'asia', maldives: 'asia', nepal: 'asia', bhutan: 'asia', afghanistan: 'asia',
    china: 'asia', japan: 'asia', korea: 'asia', north_korea: 'asia', taiwan: 'asia', mongolia: 'asia', hongkong: 'asia', macau: 'asia',
    vietnam: 'asia', thailand: 'asia', malaysia: 'asia', indonesia: 'asia', philippines: 'asia', singapore: 'asia', cambodia: 'asia', myanmar: 'asia', laos: 'asia', brunei: 'asia', timor_leste: 'asia',
    kazakhstan: 'asia', uzbekistan: 'asia', turkmenistan: 'asia', kyrgyzstan: 'asia', tajikistan: 'asia',
    france: 'europe', germany: 'europe', italy: 'europe', spain: 'europe', portugal: 'europe', uk: 'europe', ireland: 'europe', netherlands: 'europe',
    belgium: 'europe', luxembourg: 'europe', switzerland: 'europe', austria: 'europe', liechtenstein: 'europe', monaco: 'europe', andorra: 'europe',
    sweden: 'europe', norway: 'europe', denmark: 'europe', finland: 'europe', iceland: 'europe', estonia: 'europe', latvia: 'europe', lithuania: 'europe',
    greece: 'europe', croatia: 'europe', slovenia: 'europe', serbia: 'europe', bosnia: 'europe', montenegro: 'europe', albania: 'europe', north_macedonia: 'europe', malta: 'europe', san_marino: 'europe', vatican: 'europe',
    poland: 'europe', czechia: 'europe', slovakia: 'europe', hungary: 'europe', romania: 'europe', bulgaria: 'europe', moldova: 'europe', ukraine: 'europe', belarus: 'europe', russia: 'europe',
    egypt: 'africa', morocco: 'africa', tunisia: 'africa', algeria: 'africa', libya: 'africa', sudan: 'africa', mauritania: 'africa',
    ethiopia: 'africa', kenya: 'africa', tanzania: 'africa', uganda: 'africa', rwanda: 'africa', burundi: 'africa', somalia: 'africa', djibouti: 'africa', eritrea: 'africa', south_sudan: 'africa', madagascar: 'africa', mozambique: 'africa', zimbabwe: 'africa', zambia: 'africa', malawi: 'africa',
    nigeria: 'africa', ghana: 'africa', senegal: 'africa', ivory_coast: 'africa', mali: 'africa', burkina_faso: 'africa', niger: 'africa', guinea: 'africa', sierra_leone: 'africa', liberia: 'africa', togo: 'africa', benin: 'africa', gambia: 'africa', guinea_bissau: 'africa', cape_verde: 'africa',
    cameroon: 'africa', chad: 'africa', car: 'africa', congo: 'africa', drc: 'africa', gabon: 'africa', equatorial_guinea: 'africa',
    southafrica: 'africa', namibia: 'africa', botswana: 'africa', lesotho: 'africa', swaziland: 'africa', angola: 'africa', mauritius: 'africa',
    usa: 'north-america', canada: 'north-america', mexico: 'north-america', cuba: 'north-america', jamaica: 'north-america', haiti: 'north-america',
    dominican_republic: 'north-america', puerto_rico: 'north-america', costa_rica: 'north-america', panama: 'north-america', guatemala: 'north-america',
    honduras: 'north-america', el_salvador: 'north-america', nicaragua: 'north-america', belize: 'north-america', trinidad: 'north-america', bahamas: 'north-america', barbados: 'north-america',
    brazil: 'south-america', argentina: 'south-america', colombia: 'south-america', peru: 'south-america', chile: 'south-america', venezuela: 'south-america',
    ecuador: 'south-america', bolivia: 'south-america', uruguay: 'south-america', paraguay: 'south-america', guyana: 'south-america', suriname: 'south-america',
    australia: 'oceania', newzealand: 'oceania', fiji: 'oceania', papua_new_guinea: 'oceania', solomon_islands: 'oceania', vanuatu: 'oceania', samoa: 'oceania', tonga: 'oceania', kiribati: 'oceania',
    'sri-lanka': 'asia',
};

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
};

// عرض المفضلة من السيرفر
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

    const types = [
        { key: "event", gridId: "favEvents", emptyId: "emptyEvents" },
        { key: "recipe", gridId: "favRecipes", emptyId: "emptyRecipes" },
        { key: "country", gridId: "favCountries", emptyId: "emptyCountries" },
        { key: "city", gridId: "favCities", emptyId: "emptyCity" },
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
        const newPassword = document.getElementById("currentPassword").value;
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

// Toast
function showToast(message, type = "success") {
    const old = document.getElementById("safra-toast");
    if (old) old.remove();
    const colors = {
        success: { bg: "rgba(30,16,8,0.96)", border: "rgba(200,133,74,0.5)", icon: "✅" },
        error: { bg: "rgba(30,16,8,0.96)", border: "rgba(200,60,60,0.5)", icon: "❌" },
        info: { bg: "rgba(30,16,8,0.96)", border: "rgba(150,150,150,0.4)", icon: "ℹ️" },
    };
    const c = colors[type] || colors.success;
    const toast = document.createElement("div");
    toast.id = "safra-toast";
    toast.innerHTML = `<span style="font-size:18px">${c.icon}</span><span>${message}</span>`;
    toast.style.cssText = `
        position: fixed; bottom: 32px; left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${c.bg}; border: 1px solid ${c.border};
        color: #f5ede0; font-family: "Noto Sans Arabic", sans-serif;
        font-size: 15px; font-weight: 600; padding: 14px 28px;
        border-radius: 50px; display: flex; align-items: center; gap: 10px;
        z-index: 99999; box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        backdrop-filter: blur(10px); opacity: 0;
        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    }));
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

renderFavorites();