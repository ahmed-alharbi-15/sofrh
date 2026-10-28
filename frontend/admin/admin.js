const API = 'https://sofrh-1.onrender.com';

let adminEmail   = '';
let allCountries = [];
let statuses     = {};   // { countryId: "active"|"coming_soon"|"in_development" }
let activeContinent = 'all';

// ── الـ Toast ────────────────────────────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

// ── التحقق من الأدمن ─────────────────────────────────────────────────────────
async function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('safraUser') || 'null');
    if (!user?.email) return redirect();

    adminEmail = user.email;

    try {
        const res = await fetch(`${API}/admin/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminEmail })
        });
        if (!res.ok) return redirect();
        await loadPanel();
    } catch {
        redirect();
    }
}

function redirect() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('denied-screen').style.display = 'flex';
    setTimeout(() => { window.location.href = '/index/index.html'; }, 2000);
}

// ── تحميل البيانات ────────────────────────────────────────────────────────────
async function loadPanel() {
    try {
        const planRes  = await fetch('/plan/plan.js');
        const planText = await planRes.text();
        const match    = planText.match(/const\s+countries\s*=\s*(\[[\s\S]*?\]);/);
        if (!match) throw new Error('plan.js parse error');
        allCountries = JSON.parse(match[1]);

        const stRes = await fetch(`${API}/country-states`);
        statuses = stRes.ok ? await stRes.json() : {};

        renderTable(getFiltered());
        updateStats();
        loadAdminList();

    } catch (e) {
        showToast('خطأ في تحميل البيانات');
    } finally {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display   = 'block';
        document.getElementById('admin-email').textContent      = adminEmail;
    }
}

// ── حساب حالة الدولة ─────────────────────────────────────────────────────────
function getStatus(country) {
    if (statuses.hasOwnProperty(country.id)) return statuses[country.id];
    return country.ready === false ? 'coming_soon' : 'active';
}

// ── الجدول ───────────────────────────────────────────────────────────────────
const continentNames = {
    asia: 'آسيا', africa: 'أفريقيا', europe: 'أوروبا',
    north_america: 'أمريكا الشمالية', south_america: 'أمريكا الجنوبية',
    oceania: 'أوقيانوسيا'
};

const STATUS_LABELS = {
    active:         '✅ متاح',
    coming_soon:    '🕐 قريباً',
    in_development: '🔧 قيد التطوير'
};

function renderTable(list) {
    const tbody = document.querySelector('#countries-table tbody');
    tbody.innerHTML = '';

    list.forEach(c => {
        const st = getStatus(c);
        const tr = document.createElement('tr');
        tr.dataset.id = c.id;
        tr.innerHTML = `
            <td>${c.nameAr || '—'}</td>
            <td style="direction:ltr;text-align:right">${c.nameEn || c.id}</td>
            <td><span class="continent-badge">${continentNames[c.continent] || c.continent}</span></td>
            <td><span class="status-badge status-${st}">${STATUS_LABELS[st] || st}</span></td>
            <td class="action-cell">
                <button class="status-btn ${st === 'active'         ? 'active-btn'  : ''}" onclick="setStatus('${c.id}','active',this)">✅ متاح</button>
                <button class="status-btn ${st === 'coming_soon'    ? 'active-btn'  : ''}" onclick="setStatus('${c.id}','coming_soon',this)">🕐 قريباً</button>
                <button class="status-btn ${st === 'in_development' ? 'active-btn'  : ''}" onclick="setStatus('${c.id}','in_development',this)">🔧 تطوير</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ── تغيير حالة الدولة ────────────────────────────────────────────────────────
async function setStatus(countryId, newStatus, btn) {
    const allBtns = btn.closest('.action-cell').querySelectorAll('.status-btn');
    allBtns.forEach(b => b.disabled = true);

    try {
        const res = await fetch(`${API}/admin/set-country-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: countryId, status: newStatus, email: adminEmail })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'خطأ');
        }

        statuses[countryId] = newStatus;

        // حدّث الأزرار
        allBtns.forEach(b => b.classList.remove('active-btn'));
        btn.classList.add('active-btn');

        // حدّث الـ badge في نفس الصف
        const badge = btn.closest('tr').querySelector('.status-badge');
        badge.className = `status-badge status-${newStatus}`;
        badge.textContent = STATUS_LABELS[newStatus];

        updateStats();
        showToast(`${STATUS_LABELS[newStatus]} — ${countryId}`);

    } catch (e) {
        showToast('❌ ' + e.message);
    } finally {
        allBtns.forEach(b => b.disabled = false);
    }
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function updateStats() {
    const total  = allCountries.length;
    const active = allCountries.filter(c => getStatus(c) === 'active').length;
    const soon   = allCountries.filter(c => getStatus(c) === 'coming_soon').length;
    const dev    = allCountries.filter(c => getStatus(c) === 'in_development').length;
    document.getElementById('stat-total').textContent  = total;
    document.getElementById('stat-ready').textContent  = active;
    document.getElementById('stat-hidden').textContent = soon + dev;
}

// ── فلتر + بحث ────────────────────────────────────────────────────────────────
function getFiltered() {
    const q      = document.getElementById('search-input').value.trim().toLowerCase();
    const filter = document.getElementById('filter-select').value;

    return allCountries.filter(c => {
        const nameMatch     = (c.nameAr || '').includes(q) || (c.nameEn || c.id).toLowerCase().includes(q);
        const statusMatch   = filter === 'all' || getStatus(c) === filter;
        const continentMatch = activeContinent === 'all' || c.continent === activeContinent;
        return nameMatch && statusMatch && continentMatch;
    });
}

document.getElementById('search-input').addEventListener('input', () => renderTable(getFiltered()));
document.getElementById('filter-select').addEventListener('change', () => renderTable(getFiltered()));

// ── فلتر القارات ─────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeContinent = btn.dataset.continent;
        renderTable(getFiltered());
    });
});

// ── قائمة الأدمنز ─────────────────────────────────────────────────────────────
async function loadAdminList() {
    try {
        const res = await fetch(`${API}/admin/admins?admin_email=${encodeURIComponent(adminEmail)}`);
        if (!res.ok) return;
        const data = await res.json();
        renderAdminList(data.admins || []);
    } catch (_) {}
}

function renderAdminList(admins) {
    const list = document.getElementById('admins-list');
    if (!list) return;
    list.innerHTML = '';
    admins.forEach(a => {
        const row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML = `
            <span class="admin-email-text">${a.email}</span>
            <span class="admin-name-text">${a.username || ''}</span>
            <button class="remove-admin-btn" onclick="removeAdmin('${a.email}', this)">إزالة</button>
        `;
        list.appendChild(row);
    });
}

// ── منح صلاحية الأدمن ────────────────────────────────────────────────────────
async function grantAdmin() {
    const input = document.getElementById('admin-email-input');
    const btn   = document.getElementById('set-admin-btn');
    const email = input.value.trim();
    if (!email) { showToast('⚠️ أدخل الإيميل أولاً'); return; }

    btn.disabled = true;
    btn.textContent = '…';

    try {
        const res = await fetch(`${API}/admin/set-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, admin_email: adminEmail })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'خطأ');
        showToast(`✅ تم منح الصلاحية لـ ${email}`);
        input.value = '';
        await loadAdminList();
    } catch (e) {
        showToast('❌ ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'إضافة أدمن';
    }
}

// ── إزالة صلاحية الأدمن ──────────────────────────────────────────────────────
async function removeAdmin(email, btn) {
    btn.disabled = true;
    try {
        const res = await fetch(`${API}/admin/remove-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, admin_email: adminEmail })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'خطأ');
        showToast(`✅ تم إزالة صلاحية ${email}`);
        await loadAdminList();
    } catch (e) {
        showToast('❌ ' + e.message);
        btn.disabled = false;
    }
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', checkAdmin);
