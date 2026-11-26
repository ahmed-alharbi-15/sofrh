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

// --- 8. رسائل التنبيه ---
function showToast(message, type = "success") {
    const old = document.getElementById("safra-toast");
    if (old) old.remove();
    const colors = { success: "#2F9E62", error: "#C2410C", info: "#F28500" };
    const icons  = { success: "✓", error: "✕", info: "!" };
    const toast = document.createElement("div");
    toast.id = "safra-toast";
    toast.dir = "rtl";
    toast.setAttribute("role", "status");
    toast.innerHTML = `<span class="ic" style="background:${colors[type] || colors.info}">${icons[type] || icons.info}</span><span style="flex:1">${message}</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("show")));
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 350); }, 3000);
}

function showConfirm(message, onConfirm, onCancel) {
    const old = document.getElementById("safra-confirm");
    if (old) old.remove();
    const overlay = document.createElement("div");
    overlay.id = "safra-confirm";
    overlay.dir = "rtl";
    overlay.innerHTML = `<div class="box" role="dialog" aria-modal="true"><p>${message}</p><div class="row"><button type="button" id="sc-confirm" class="sf-btn sf-btn-o">تأكيد</button><button type="button" id="sc-cancel" class="sf-btn sf-btn-line">إلغاء</button></div></div>`;
    document.body.appendChild(overlay);
    const close = (cb) => { overlay.remove(); if (cb) cb(); };
    document.getElementById("sc-confirm").addEventListener("click", () => close(onConfirm));
    document.getElementById("sc-cancel").addEventListener("click", () => close(onCancel));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(onCancel); });
}

function resolveImg(src) {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    return '/img/' + src.replace(/^\/img\//, '');
}

// --- 9. القائمة الجانبية (الجوال) ---
if (typeof menuBtn === 'undefined') {
    var menuBtn  = document.getElementById("menu-btn");
    var sideMenu = document.getElementById("side-menu");
    var closeBtn = document.getElementById("close-btn");
}
if (menuBtn && sideMenu && closeBtn) {
    function openMenu() {
        sideMenu.classList.add("menu-open");
        document.body.style.overflow = "hidden";
    }
    function closeMenu() {
        sideMenu.classList.remove("menu-open");
        document.body.style.overflow = "";
    }
    menuBtn.addEventListener("click", function(e) { e.stopPropagation(); openMenu(); });
    closeBtn.addEventListener("click", function(e) { e.stopPropagation(); closeMenu(); });
    document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeMenu(); });
}

// --- 10. الوضع الليلي (الأساسي) — الزر داخل النافبار ---
(function() {
    const THEME_KEY = "theme";
    const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const root = document.documentElement;
    if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark");
    const isDark = () => root.getAttribute("data-theme") === "dark";

    const btn = document.createElement("button");
    btn.id = "dark-mode-toggle";
    btn.type = "button";
    const paint = () => {
        btn.innerHTML = isDark() ? SUN : MOON;
        btn.setAttribute("aria-label", isDark() ? "الوضع النهاري" : "الوضع الليلي");
    };
    paint();
    btn.addEventListener("click", () => {
        const next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem(THEME_KEY, next);
        paint();
    });
    const slot = document.getElementById("sfThemeSlot");
    if (slot) slot.appendChild(btn);
})();

// --- 11. زر العودة للأعلى ---
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
}, { passive: true });

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


// --- 13. النافبار يصير غامق بعد التمرير ---
(function() {
    const nav = document.getElementById("sfNav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
})();

// --- 14. أنيميشن الهيرو (طيارات / بخار وبهارات / ألعاب نارية وفوانيس) ---
(function () {
  /* ---------- hero fx ---------- */
  var SHAPES = {
    jet: ["0 0 24 24", 1.0, '<g transform="rotate(-90 12 12)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></g>'],
    liner: ["0 0 64 24", 2.6, '<path d="M2 13 C2 10 6 8.5 11 8.5 L48 8.5 L56 1.5 L61 1.5 L57 9 L62 10.5 L62 13.5 L11 15.5 C6 15.5 2 15 2 13 Z"/><path d="M24 12.5 L39 22 L44 22 L35 12.5 Z"/><path d="M52 10 L58 6 L60 6 L56 11 Z" opacity=".6"/><g style="fill:var(--plane-win)"><circle cx="16" cy="11.2" r=".9"/><circle cx="19" cy="11.2" r=".9"/><circle cx="22" cy="11.2" r=".9"/><circle cx="25" cy="11.2" r=".9"/><circle cx="28" cy="11.2" r=".9"/><circle cx="31" cy="11.2" r=".9"/><circle cx="34" cy="11.2" r=".9"/><circle cx="37" cy="11.2" r=".9"/><circle cx="40" cy="11.2" r=".9"/></g>'],
    prop: ["0 0 48 24", 1.9, '<path d="M6 12 C6 9.5 9 8.5 13 8.5 L36 9.5 L42 3 L46 3 L43 10.5 L46 12 L46 14 L13 15.5 C9 15.5 6 14.5 6 12 Z"/><path d="M17 12 L13 21 L17 21 L24 12 Z"/><path d="M15 9 L19 5 L25 5 L24 9 Z" style="fill:var(--plane-win)"/><rect x="4" y="11" width="3" height="2" rx="1"/><ellipse class="sf-propel" cx="4" cy="12" rx="1.2" ry="7" opacity=".7"/>'],
    paper: ["0 0 48 28", 1.7, '<path d="M2 14 L46 2 L32 26 L24 18 Z"/><path d="M2 14 L46 2 L24 18 Z" style="fill:var(--plane-win)" opacity=".55"/><path d="M24 18 L26 25 L32 26 Z" opacity=".75"/>']
  };
  var FLEET = [["90px", 30, 46, 10, 280, 1, "liner"], ["170px", 26, 40, 30, 220, .95, "jet"], ["250px", 20, 70, 48, 120, .85, "prop"], ["60px", 18, 58, 20, 60, .8, "paper"], ["320px", 16, 84, 64, 160, .7, "jet"]];
  var SPICES = {
    card: '<g transform="rotate(-35 20 20)"><ellipse class="f" cx="20" cy="20" rx="8" ry="15"/><path class="d" d="M20 6 C 17 14 17 26 20 34" stroke-width="1.3"/><path class="d" d="M20 5 L20 2" stroke-width="1.8" stroke-linecap="round"/></g>',
    cin: '<g transform="rotate(25 20 20)"><rect class="f" x="6" y="14" width="28" height="12" rx="5"/><path class="d" d="M10 14 v12 M15 14 v12" stroke-width="1" opacity=".45"/><circle class="f" cx="31" cy="20" r="5.5"/><path class="d" d="M31 20 m-2.5 0 a2.5 2.5 0 1 1 2.5 2.5" stroke-width="1.3"/></g>',
    bay: '<g transform="rotate(-20 20 20)"><path class="f" d="M20 3 C 31 12 31 28 20 37 C 9 28 9 12 20 3 Z"/><path class="d" d="M20 6 V36 M20 14 L26 10 M20 20 L27 16 M20 26 L26 23 M20 14 L14 10 M20 20 L13 16 M20 26 L14 23" stroke-width="1.1" opacity=".6"/></g>',
    star: (function () { var s = ""; for (var k = 0; k < 8; k++) s += '<ellipse class="f" cx="20" cy="10" rx="4.2" ry="9" transform="rotate(' + (k * 45) + ' 20 20)"/>'; return s + '<circle class="dd" cx="20" cy="20" r="4"/>'; })(),
    chili: '<path class="f" d="M12 9 C 10 20 18 31 33 34 C 27 27 22 18 20 9 C 18 6 14 6 12 9 Z"/><path class="f" d="M15 8 C 15 5 17 3 20 3" style="fill:none;stroke:var(--plane)" stroke-width="2.6" stroke-linecap="round"/><path class="d" d="M15 14 C 16 20 20 25 25 28" stroke-width="1.6" stroke-linecap="round"/>'
  };
  var STARS = [[80,60,1.4,0],[210,140,1,1],[340,40,1.6,2],[460,190,1,.5],[590,90,1.3,1.5],[720,30,1,2.2],[860,120,1.5,.8],[990,60,1,1.8],[1120,170,1.4,.3],[1250,50,1.1,2.6],[1380,130,1.5,1.2],[150,260,1,2],[520,300,1.2,.9],[1300,280,1,1.4],[930,240,1.2,2.4]];

  function starsSvg() {
    var c = STARS.map(function (s) { return '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '" fill="#fff" style="animation-delay:-' + s[3] + 's"/>'; }).join("");
    return '<svg class="sf-stars" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' + c + "</svg>";
  }
  function planes() {
    return FLEET.map(function (p, i) {
      var sh = SHAPES[p[6]], h = p[1], w = Math.round(h * sh[1]);
      var led = p[6] === "paper" ? "" : '<span class="led" style="left:' + (w / 2 - 2) + "px;top:" + (h / 2 - 2) + 'px"></span>';
      return '<div class="sf-plane' + (i > 2 ? ' sf-m-hide' : '') + '" style="top:' + p[0] + ";animation-duration:" + p[2] + "s;animation-delay:-" + p[3] + "s;opacity:" + p[5] + '"><div class="in"><svg width="' + w + '" height="' + h + '" viewBox="' + sh[0] + '" aria-hidden="true">' + sh[2] + "</svg>" + led + '<div class="trail" style="width:' + p[4] + 'px"></div></div></div>';
    }).join("");
  }
  function recipesFx() {
    var steam = [[10, 6, 0], [16, 7.5, 3], [23, 6.5, 1.5]].map(function (s) {
      return '<div class="sf-steam" style="left:' + s[0] + "%;animation-duration:" + s[1] + "s;animation-delay:-" + s[2] + 's"><svg viewBox="0 0 60 200" width="60" height="200" aria-hidden="true"><path d="M30 200 C 10 160 50 130 30 95 C 12 62 48 38 30 0" fill="none" stroke-width="14" stroke-linecap="round"/></svg></div>';
    }).join("");
    var seq = ["card", "cin", "bay", "star", "chili", "bay"];
    var sp = [[6, 40, 18, 0], [16, 32, 22, 8], [32, 44, 19, 3], [58, 34, 23, 12], [72, 42, 20, 6], [90, 34, 21, 15]].map(function (s, i) {
      return '<div class="sf-spice' + (i > 3 ? ' sf-m-hide' : '') + '" style="left:' + s[0] + "%;width:" + s[1] + "px;height:" + s[1] + "px;animation-duration:" + s[2] + "s;animation-delay:-" + s[3] + 's"><svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">' + SPICES[seq[i]] + "</svg></div>";
    }).join("");
    return steam + sp;
  }
  function eventsFx() {
    function burst(c) {
      var r = "";
      for (var a = 0; a < 16; a++) {
        var t = a * 0.3927;
        r += '<line x1="85" y1="85" x2="' + (85 + 70 * Math.cos(t)).toFixed(1) + '" y2="' + (85 + 70 * Math.sin(t)).toFixed(1) + '" style="stroke:' + c + '" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="2 9"/>';
      }
      return '<svg viewBox="0 0 170 170" width="100%" height="100%" aria-hidden="true">' + r + "</svg>";
    }
    var b = [[10, 90, 4.5, 0, "a"], [24, 170, 5, 2.2, "b"], [70, 70, 4.2, 1.1, "a"], [84, 150, 5.4, 3.3, "b"], [48, 40, 4.8, 3.9, "a"]].map(function (s) {
      return '<div class="sf-burst" style="left:' + s[0] + "%;top:" + s[1] + "px;animation-duration:" + s[2] + "s;animation-delay:-" + s[3] + 's">' + burst("var(--fx-" + s[4] + ")") + "</div>";
    }).join("");
    var l = [[6, 14, 0], [17, 18, 6], [29, 15, 10], [63, 17, 3], [77, 13, 8], [90, 16, 12]].map(function (s, i) {
      return '<span class="sf-lantern' + (i > 3 ? ' sf-m-hide' : '') + '" style="left:' + s[0] + "%;animation-duration:" + s[1] + "s;animation-delay:-" + s[2] + 's"></span>';
    }).join("");
    return b + l;
  }
  function setupHeroFx() {
    document.querySelectorAll(".sf-hero").forEach(function (hero) {
      if (hero.querySelector(".sf-fx")) return;
      var kind = hero.getAttribute("data-anim");
      var fx = document.createElement("div");
      fx.className = "sf-fx";
      fx.setAttribute("aria-hidden", "true");
      fx.innerHTML = starsSvg() + (kind === "planes" ? planes() : kind === "recipes" ? recipesFx() : kind === "events" ? eventsFx() : "");
      hero.insertBefore(fx, hero.querySelector(".sf-hero-c"));
    });
  }

  setupHeroFx();
})();

// --- 15. صورة شفافة بالخلفية لما تختار وصفة / فعالية / مدينة ---
document.addEventListener("click", function (e) {
    const el = e.target.closest && e.target.closest(".recipes-item, .event-item, .cite");
    if (!el || (e.target.closest && e.target.closest(".save-btn"))) return;
    const src = el.getAttribute("data-img") || (el.querySelector("img") && el.querySelector("img").getAttribute("src"));
    if (!src) return;
    let g = document.getElementById("sf-ghost");
    if (!g) { g = document.createElement("div"); g.id = "sf-ghost"; g.setAttribute("aria-hidden", "true"); document.body.prepend(g); }
    g.innerHTML = '<img alt="" src="' + src.replace(/"/g, "&quot;") + '">';
}, true);

// --- 16. أكورديون الرئيسية ---
document.querySelectorAll(".sf-acc").forEach(function (acc) {
    acc.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
            const open = b.getAttribute("aria-expanded") === "true";
            acc.querySelectorAll("button").forEach(function (o) {
                o.setAttribute("aria-expanded", "false");
                o.querySelector(".pl").textContent = "+";
                const body = document.getElementById(o.getAttribute("aria-controls"));
                if (body) body.hidden = true;
            });
            if (!open) {
                b.setAttribute("aria-expanded", "true");
                b.querySelector(".pl").textContent = "−";
                const body = document.getElementById(b.getAttribute("aria-controls"));
                if (body) body.hidden = false;
            }
        });
    });
});

// --- 17. بحث الرئيسية يودي لصفحة الدول، والدول تقرأ ?q= ---
(function () {
    const f = document.getElementById("sfHomeSearch");
    if (f) f.addEventListener("submit", function (e) {
        e.preventDefault();
        const q = (f.querySelector("input").value || "").trim();
        window.location.href = "/countries/countries.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
    const q = new URLSearchParams(location.search).get("q");
    const inp = document.getElementById("searchInput");
    if (q && inp) {
        inp.value = q;
        setTimeout(function () {
            inp.dispatchEvent(new Event("input", { bubbles: true }));
            inp.dispatchEvent(new Event("keyup", { bubbles: true }));
        }, 0);
    }
})();
