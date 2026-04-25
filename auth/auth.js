// --- 1. وظيفة إنشاء الحساب ---
console.log("ملف auth.js محمل وجاهز!"); 

const signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
    console.log("تم العثور على زر إنشاء الحساب (signupBtn)");
    
    signupBtn.onclick = async function(e) {
        e.preventDefault(); 
        console.log("تم ضغط الزر بنجاح!");

        // جمع البيانات من الحقول
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        console.log("البيانات المجموعة:", { username, email, phone, password });

        try {
            console.log("جاري الإرسال إلى السيرفر في Render...");
            const response = await fetch('https://sofrh-1.onrender.com/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password })
            });

            const data = await response.json();
            console.log("رد السيرفر:", data);

            if (response.ok) {
                localStorage.setItem("safraUser", JSON.stringify({
                    name: username,
                    email: email,
                    avatar: ""
                }));
                alert(data.message);
                // التحويل لرابط نسبي لضمان العمل عند خويك
                window.location.href = "../index/index.html";
            } else {
                alert("خطأ: " + (data.detail || "مشكلة في البيانات"));
            }
        } catch (err) {
            console.error("فشل الاتصال:", err);
            alert("السيرفر لا يستجيب أو هناك مشكلة في الشبكة!");
        }
    };
} else {
    console.error("تحذير: لم يتم العثور على عنصر بـ ID: signupBtn في هذه الصفحة");
}

// --- 2. وظيفة تسجيل الدخول ---
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('https://sofrh-1.onrender.com/login', {
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
                window.location.href = "../index/index.html";
            } else {
                alert("خطأ: " + data.detail);
            }
        } catch (err) {
            alert("السيرفر طافي!");
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
        if (userAvatar && user.avatar) userAvatar.src = user.avatar;
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
    }
}

// --- 4. تسجيل الخروج ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("safraUser");
        window.location.href = "../index/index.html";
    });
}

checkAuth();
// --- 5. حفظ في المفضلة ---
function saveItem(type, id, name, img) {
    const user = JSON.parse(localStorage.getItem("safraUser"));
    if (!user) {
        alert("سجل دخولك أولاً!");
        window.location.href = "../auth/login.html";
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

// --- 6. القائمة الجانبية ---
if (typeof menuBtn === 'undefined') {
    var menuBtn = document.getElementById("menu-btn");
    var sideMenu = document.getElementById("side-menu");
    var closeBtn = document.getElementById("close-btn");
}

if (menuBtn && sideMenu && closeBtn) {
    menuBtn.addEventListener("click", () => { sideMenu.style.right = "0px"; });
    closeBtn.addEventListener("click", () => { sideMenu.style.right = "-260px"; });
    document.addEventListener("click", (e) => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.style.right = "-260px";
        }
    });
}