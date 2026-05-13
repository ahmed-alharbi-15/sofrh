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

// تسجيل الخروج
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("safraUser");
        window.location.href = "/frontend/index/index.html";
    });
}

checkAuth();

// عرض بيانات المستخدم
const currentUser = JSON.parse(localStorage.getItem("safraUser"));

if (!currentUser) {
    window.location.href = "/frontend/auth/login.html";
} else {
    document.getElementById("profileName").textContent = currentUser.name;
    document.getElementById("profileEmail").textContent = currentUser.email;
    if (currentUser.avatar) {
        document.getElementById("profileAvatar").src = currentUser.avatar;
    }

    if (document.getElementById("settingsName"))
        document.getElementById("settingsName").value = currentUser.name || "";
    if (document.getElementById("settingsEmail"))
        document.getElementById("settingsEmail").value = currentUser.email || "";
    if (document.getElementById("settingsPhone"))
        document.getElementById("settingsPhone").value = currentUser.phone || "";
}

// تغيير الصورة
// تغيير الصورة والرفع للسيرفر
const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
    avatarInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById("profileAvatar").src = event.target.result;
        };
        reader.readAsDataURL(file);

        const user = JSON.parse(localStorage.getItem("safraUser"));
        const username = user.name;

        const formData = new FormData();
        formData.append("file", file);

        try {
            console.log("جاري الرفع...");
            const response = await fetch(`https://sofrh-1.onrender.com/upload-avatar?username=${username}`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ تم حفظ الصورة في السحاب بنجاح!");
                user.avatar = data.url;
                localStorage.setItem("safraUser", JSON.stringify(user));
            } else {
                alert("⚠️ فشل الرفع: " + data.message);
            }
        } catch (error) {
            console.error("خطأ في الاتصال:", error);
            alert("❌ حدث خطأ أثناء الاتصال بالسيرفر");
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
        const user = JSON.parse(localStorage.getItem("safraUser"));

        if (newPassword !== confirmPassword) {
            alert("كلمة المرور الجديدة مو متطابقة!");
            return;
        }

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