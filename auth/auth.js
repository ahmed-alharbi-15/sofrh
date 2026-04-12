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
            if (response.ok) alert(data.message);
            else alert("خطأ: " + data.detail);
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
                alert(data.message);
                window.location.href = "/index/index.html"; // يروح للرئيسية بعد الدخول
            } else alert("خطأ: " + data.detail);
        } catch (err) { alert("السيرفر طافي!"); }
    });
}