// --- جزئية الربط 2: إرسال البيانات للسيرفر (Fetch) ---

// 1. وظيفة إنشاء الحساب
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://127.0.0.1:8001/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("safraUser", JSON.stringify({
                    name: username,
                    email: email,
                    avatar: ""
                }));
                alert(data.message);
                window.location.href = "/index/index.html";
            } else alert("خطأ: " + data.detail);
        } catch (err) { alert("السيرفر طافي!"); }
    });
}

// 2. وظيفة تسجيل الدخول
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://127.0.0.1:8001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("safraUser", JSON.stringify({
                    name: data.username || email.split("@")[0],
                    email: email,
                    avatar: ""
                }));
                alert(data.message);
                window.location.href = "/index/index.html";
            } else alert("خطأ: " + data.detail);
        } catch (err) { alert("السيرفر طافي!"); }
    });
}

// 3. التحقق من الجلسة وإظهار/إخفاء الأزرار
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

// 4. تسجيل الخروج
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("safraUser");
        window.location.href = "/index/index.html";
    });
}

checkAuth();

// --- جزئية الحفظ (Save) ---
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


// --- جزئية عرض التفاصيل (Modal) ---
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


// JS للقائمة الجانبية
const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.getElementById("close-btn");

// فتح القائمة
menuBtn.addEventListener("click", () => {
  sideMenu.style.right = "0px";
});

// زر الإغلاق
closeBtn.addEventListener("click", () => {
  sideMenu.style.right = "-260px";
});

// إغلاق عند الضغط خارجها
document.addEventListener("click", (e) => {
  if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
    sideMenu.style.right = "-260px";
  }
});
