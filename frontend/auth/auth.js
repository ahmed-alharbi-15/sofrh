document.documentElement.style.setProperty('--navbar-opacity', '0');

// --- 1. وظيفة إنشاء الحساب ---

const signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
    signupBtn.onclick = async function(e) {
        e.preventDefault(); 
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = "flex";

        try {
            const response = await fetch('https://sofrh-1.onrender.com/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("safraUser", JSON.stringify({ name: username, email, avatar: "" }));
                showToast("تم إنشاء الحساب بنجاح ✨", "success");
                setTimeout(() => window.location.href = "/index/index.html", 1500);
            } else {
                if (loadingScreen) loadingScreen.style.display = "none";
                showToast("⚠️ " + (data.detail || "حدث خطأ في البيانات"), "error");
            }
        } catch (err) {
            if (loadingScreen) loadingScreen.style.display = "none";
            console.error(err);
            showToast("فشل الاتصال بالسيرفر، تأكد من اتصالك!", "error");
        }
    };
}

// --- 2. وظيفة تسجيل الدخول ---
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = "flex";

        try {
            const response = await fetch('https://sofrh-1.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                let avatar = "";
                try {
                    const avatarRes = await fetch(`https://sofrh-1.onrender.com/avatar/${email}`);
                    const avatarData = await avatarRes.json();
                    avatar = avatarData.avatar || "";
                } catch(e) {}

                localStorage.setItem("safraUser", JSON.stringify({
                    name: data.username || email.split("@")[0],
                    email,
                    avatar
                }));
                if (avatar) localStorage.setItem("safraAvatar", avatar);
                showToast(`أهلاً بك يا ${data.username || email.split("@")[0]} ✨`, "success");
                setTimeout(() => window.location.href = "/index/index.html", 1500);
            } else {
                if (loadingScreen) loadingScreen.style.display = "none";
                showToast("خطأ: " + data.detail, "error");
            }
        } catch (err) {
            if (loadingScreen) loadingScreen.style.display = "none";
            showToast("السيرفر طافي! حاول لاحقاً", "error");
        }
    });
}

// --- 3. التحقق من الجلسة ---
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
        if (userAvatar) {
            const savedAvatar = localStorage.getItem("safraAvatar");
            const src = user.avatar || savedAvatar || null;
            if (src) userAvatar.src = src;
        }
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.add('loaded');

    document.querySelectorAll('.auth-buttons, .user-menu').forEach(el => el.style.visibility = 'visible');

    document.documentElement.style.setProperty('--navbar-opacity', '1');
}

// --- 4. تسجيل الخروج ---
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

// --- 5. حفظ في المفضلة ---
async function saveItem(type, id, name, img) {
    const user = JSON.parse(localStorage.getItem("safraUser"));
    if (!user) {
        showToast("سجل دخولك أولاً! 🔐", "error");
        setTimeout(() => window.location.href = "/auth/login.html", 1500);
        return;
    }

    try {
        const response = await fetch('https://sofrh-1.onrender.com/favorites/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, type, id, name, img })
        });
        const data = await response.json();
        if (response.ok) {
            showToast("تمت الإضافة للمفضلة ✨", "success");
        } else {
            showToast(data.detail || "موجود بالفعل في المفضلة!", "info");
        }
    } catch (err) {
        showToast("فشل الاتصال بالسيرفر", "error");
    }
}

// --- 6. جلب المفضلة ---
async function loadFavorites() {
    const user = JSON.parse(localStorage.getItem("safraUser"));
    if (!user) return {};
    try {
        const response = await fetch(`https://sofrh-1.onrender.com/favorites/${user.email}`);
        const data = await response.json();
        return data.favorites || {};
    } catch (err) {
        return {};
    }
}

// --- 7. حذف من المفضلة ---
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
}

// --- 8. Toast ---
function showToast(message, type = "success") {
    const old = document.getElementById("safra-toast");
    if (old) old.remove();

    const colors = {
        success: { bg: "rgba(30,16,8,0.96)", border: "rgba(200,133,74,0.5)", icon: "✅" },
        error:   { bg: "rgba(30,16,8,0.96)", border: "rgba(200,60,60,0.5)",  icon: "❌" },
        info:    { bg: "rgba(30,16,8,0.96)", border: "rgba(150,150,150,0.4)", icon: "ℹ️" },
    };
    const c = colors[type] || colors.success;

    const toast = document.createElement("div");
    toast.id = "safra-toast";
    toast.innerHTML = `<span style="font-size:18px">${c.icon}</span><span>${message}</span>`;
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${c.bg};
        border: 1px solid ${c.border};
        color: #f5ede0;
        font-family: "Noto Sans Arabic", sans-serif;
        font-size: 15px;
        font-weight: 600;
        padding: 14px 28px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 99999;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        backdrop-filter: blur(10px);
        opacity: 0;
        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap;
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
        });
    });
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// --- 9. القائمة الجانبية ---
if (typeof menuBtn === 'undefined') {
    var menuBtn = document.getElementById("menu-btn");
    var sideMenu = document.getElementById("side-menu");
    var closeBtn = document.getElementById("close-btn");
}

if (menuBtn && sideMenu && closeBtn) {
    menuBtn.addEventListener("click", () => {
        sideMenu.style.right = "0px";
        sideMenu.classList.add("menu-open");
    });
    closeBtn.addEventListener("click", () => {
        sideMenu.style.right = "-260px";
        sideMenu.classList.remove("menu-open");
    });
    document.addEventListener("click", (e) => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.style.right = "-260px";
            sideMenu.classList.remove("menu-open");
        }
    });
}