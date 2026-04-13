// JS للقائمة الجانبية
const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.getElementById("close-btn");

menuBtn.addEventListener("click", () => { sideMenu.style.right = "0px"; });
closeBtn.addEventListener("click", () => { sideMenu.style.right = "-260px"; });
document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        sideMenu.style.right = "-260px";
    }
});

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

// تسجيل الخروج
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("safraUser");
        window.location.href = "/index/index.html";
    });
}

checkAuth();

// عرض بيانات المستخدم
const user = JSON.parse(localStorage.getItem("safraUser"));

if (!user) {
    window.location.href = "/auth/login.html";
} else {
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    if (user.avatar) {
        document.getElementById("profileAvatar").src = user.avatar;
    }

    // تحميل بيانات الإعدادات
    if (document.getElementById("settingsName"))
        document.getElementById("settingsName").value = user.name || "";
    if (document.getElementById("settingsEmail"))
        document.getElementById("settingsEmail").value = user.email || "";
    if (document.getElementById("settingsPhone"))
        document.getElementById("settingsPhone").value = user.phone || "";
}

// تغيير الصورة
document.getElementById("avatarInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const imgSrc = event.target.result;
        document.getElementById("profileAvatar").src = imgSrc;
        const user = JSON.parse(localStorage.getItem("safraUser"));
        user.avatar = imgSrc;
        localStorage.setItem("safraUser", JSON.stringify(user));
        const userAvatar = document.getElementById("userAvatar");
        if (userAvatar) userAvatar.src = imgSrc;
    };
    reader.readAsDataURL(file);
});

// التنقل بين الأقسام
document.querySelectorAll(".profile-nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".profile-nav a").forEach(a => a.classList.remove("active"));
        document.querySelectorAll(".fav-section").forEach(s => s.classList.remove("active"));
        link.classList.add("active");
        const section = link.getAttribute("data-section");
        document.getElementById(`section-${section}`).classList.add("active");
    });
});

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
            card.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="fav-card-info">
                    <span>${item.name}</span>
                    <button class="fav-remove" onclick="removeItem('${key}', '${item.id}')">🗑️</button>
                </div>
            `;
            grid.appendChild(card);
        });
    });
}

// حذف من المفضلة
function removeItem(type, id) {
    const saved = JSON.parse(localStorage.getItem("safraFavorites") || "{}");
    if (!saved[type]) return;
    saved[type] = saved[type].filter(item => item.id !== id);
    localStorage.setItem("safraFavorites", JSON.stringify(saved));
    renderFavorites();
}

// دالة الحفظ في المفضلة
function saveItem(type, id, name, img) {
    const user = JSON.parse(localStorage.getItem("safraUser"));
    if (!user) {
        alert("سجل دخولك أولاً!");
        window.location.href = "/auth/login.html";
        return;
    }

    const saved = JSON.parse(localStorage.getItem("safraFavorites") || "{}");
    if (!saved[type]) saved[type] = [];

    const exists = saved[type].find(item => item.id === id);
    if (exists) {
        alert("موجود بالفعل في المفضلة!");
        return;
    }

    saved[type].push({ id, name, img });
    localStorage.setItem("safraFavorites", JSON.stringify(saved));
    alert("✅ تمت الإضافة للمفضلة!");
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
            const response = await fetch("http://127.0.0.1:8001/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone })
            });
            const data = await response.json();
            if (response.ok) {
                const user = JSON.parse(localStorage.getItem("safraUser"));
                user.name = name;
                user.email = email;
                user.phone = phone;
                localStorage.setItem("safraUser", JSON.stringify(user));
                document.getElementById("profileName").textContent = name;
                document.getElementById("profileEmail").textContent = email;
                alert("✅ تم حفظ التغييرات!");
            } else alert("خطأ: " + data.detail);
        } catch (err) { alert("السيرفر طافي!"); }
    });
}

// تغيير كلمة المرور
const changePasswordBtn = document.getElementById("changePasswordBtn");
if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", async () => {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            alert("كلمة المرور الجديدة مو متطابقة!");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8001/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
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