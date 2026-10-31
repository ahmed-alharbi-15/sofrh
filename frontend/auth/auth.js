(function() {
    const user = JSON.parse(localStorage.getItem('safraUser') || 'null');
    if (user) {
        document.documentElement.classList.add('user-logged-in');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        if (userName) userName.textContent = user.name || '';
        if (userAvatar) {
            const src = user.avatar || localStorage.getItem('safraAvatar') || '';
            if (src) userAvatar.src = src;
        }
    } else {
        document.documentElement.classList.add('user-logged-out');
    }
})();

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
    const userName = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");

    if (user) {
        document.documentElement.classList.remove('user-logged-out');
        document.documentElement.classList.add('user-logged-in');
        if (userName) userName.textContent = user.name || '';
        if (userAvatar) {
            const savedAvatar = localStorage.getItem("safraAvatar");
            const src = user.avatar || savedAvatar || null;
            if (src) userAvatar.src = src;
        }
    } else {
        document.documentElement.classList.remove('user-logged-in');
        document.documentElement.classList.add('user-logged-out');
    }
}

// --- 4. تسجيل الخروج ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showConfirm("هل تريد تسجيل الخروج؟", () => {
            localStorage.removeItem("safraUser");
            localStorage.removeItem("safraAvatar");
            window.location.href = "/index/index.html";
        });
    });
}

checkAuth();

// --- 3b. فحص صلاحية الأدمن وإظهار رابط الإدارة ---
(async function checkAdminLink() {
    const user = JSON.parse(localStorage.getItem('safraUser') || 'null');
    if (!user?.email) return;

    try {
        const res = await fetch('https://sofrh-1.onrender.com/admin/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.admin === true) {
            const link = document.getElementById('adminLink');
            if (link) link.style.display = 'inline-flex';
        }
    } catch (_) { /* silent fail — لا تأثير على بقية الصفحة */ }
})();

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
    const iconColors = { success: "#22c55e", error: "#ef4444", info: "#F28500" };
    const icons      = { success: "✓",       error: "✕",       info: "!"      };
    const col = iconColors[type] || iconColors.info;
    const ico = icons[type]      || icons.info;
    const toast = document.createElement("div");
    toast.id = "safra-toast";
    toast.dir = "rtl";
    toast.innerHTML = `
        <span style="width:22px;height:22px;border-radius:50%;background:${col};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${ico}</span>
        <span style="flex:1">${message}</span>
        <button id="safra-toast-close" style="background:none;border:none;color:#FAF5EB;font-size:18px;cursor:pointer;padding:0 0 0 6px;line-height:1;opacity:.7;flex-shrink:0">✕</button>
    `;
    toast.style.cssText = `
        position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-20px);
        background:#32127A;border:1px solid ${col};color:#FAF5EB;
        font-family:'Noto Sans Arabic',sans-serif;font-size:15px;font-weight:600;
        padding:12px 18px;border-radius:14px;display:flex;align-items:center;gap:10px;
        z-index:99999;box-shadow:0 8px 30px rgba(0,0,0,0.35);backdrop-filter:blur(10px);
        opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        min-width:260px;max-width:90vw;direction:rtl;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    }));
    const dismiss = () => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(-20px)";
        setTimeout(() => toast.remove(), 350);
    };
    const timer = setTimeout(dismiss, 3000);
    document.getElementById("safra-toast-close")?.addEventListener("click", () => { clearTimeout(timer); dismiss(); });
}

function showConfirm(message, onConfirm, onCancel) {
    const old = document.getElementById("safra-confirm");
    if (old) old.remove();
    const overlay = document.createElement("div");
    overlay.id = "safra-confirm";
    overlay.dir = "rtl";
    overlay.innerHTML = `
        <div style="background:#32127A;border:1px solid rgba(250,245,235,0.15);border-radius:16px;padding:28px 24px;max-width:360px;width:90%;text-align:center;direction:rtl;">
            <p style="color:#FAF5EB;font-family:'Noto Sans Arabic',sans-serif;font-size:16px;font-weight:600;margin:0 0 24px">${message}</p>
            <div style="display:flex;gap:12px;justify-content:center;">
                <button id="sc-confirm" style="background:#F28500;color:#fff;border:none;border-radius:10px;padding:10px 28px;font-family:'Noto Sans Arabic',sans-serif;font-size:15px;font-weight:700;cursor:pointer">تأكيد</button>
                <button id="sc-cancel" style="background:rgba(250,245,235,0.12);color:#FAF5EB;border:1px solid rgba(250,245,235,0.2);border-radius:10px;padding:10px 28px;font-family:'Noto Sans Arabic',sans-serif;font-size:15px;font-weight:600;cursor:pointer">إلغاء</button>
            </div>
        </div>
    `;
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:center;justify-content:center;";
    document.body.appendChild(overlay);
    const close = (cb) => { overlay.remove(); if (cb) cb(); };
    document.getElementById("sc-confirm").addEventListener("click", () => close(onConfirm));
    document.getElementById("sc-cancel").addEventListener("click",  () => close(onCancel));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(onCancel); });
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

// --- 10. الوضع الليلي (Dark Mode) ---
// ملاحظة: التلوين الفعلي محصور في كل ملف CSS بقاعدة واحدة فقط:
// html[data-theme="dark"] body { background-color: #0B0933; }
// يعني الوضع الليلي يغيّر خلفية الصفحة فقط، وما يمس الكروت
// (.country-card/.event-card/.foods-card/.card) ولا الصور ولا اللوغو
// ولا الأفتار ولا الألوان الأصلية (navbar/البرتقالي/النصوص البيضاء).
// هذا الكود هنا مسؤول فقط عن: تبديل السمة (data-theme)، الحفظ في
// localStorage، وزر التبديل نفسه (شكل الزر مستقل عن باقي الصفحة).
(function() {
    const THEME_KEY = "theme";
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    const style = document.createElement("style");
    style.id = "safra-dark-mode-style";
    style.textContent = `
        html[data-theme="dark"] { color-scheme: dark; }
        #dark-mode-toggle {
            position: fixed;
            bottom: 22px;
            left: 22px;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: #32127A;
            color: #FAF5EB;
            border: none;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 18px rgba(0,0,0,.35);
            z-index: 99998;
            transition: transform .2s ease;
        }
        #dark-mode-toggle:hover { transform: scale(1.08); }
    `;
    document.head.appendChild(style);

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "dark-mode-toggle";
    toggleBtn.type = "button";
    toggleBtn.setAttribute("aria-label", "تبديل الوضع الليلي");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";

    toggleBtn.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") !== "dark";
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
        toggleBtn.textContent = isDark ? "☀️" : "🌙";
    });

    document.body.appendChild(toggleBtn);
})();

// --- 11. زر العودة للأعلى ---
(function() {
    const style = document.createElement("style");
    style.id = "safra-scroll-top-style";
    style.textContent = `
        #scrollTopBtn {
            position: fixed;
            bottom: 82px;
            left: 20px;
            background: #F28500;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            font-size: 20px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: opacity .25s ease;
        }
        #scrollTopBtn:hover { opacity: 0.85; }
        .back-btn {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #32127A;
            color: #fff;
            border: none;
            border-radius: 999px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: opacity .25s ease;
        }
        .back-btn:hover { opacity: 0.85; }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', () => {
        const btn = document.getElementById('scrollTopBtn');
        if (btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
})();

// --- 12. نبضة النشاط (User Ping) ---
(function() {
    const user = JSON.parse(localStorage.getItem('safraUser') || 'null');
    if (!user?.email) return;

    const ping = () => fetch('https://sofrh-1.onrender.com/user/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
    }).catch(() => {});

    ping(); // فوراً عند التحميل
    setInterval(ping, 120000); // كل دقيقتين
})();
