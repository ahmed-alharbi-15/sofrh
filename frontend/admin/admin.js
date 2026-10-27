const API = 'https://sofrh-1.onrender.com';

let adminEmail = '';
let allCountries = [];
let overrides = {};   // { countryId: bool }

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

// ── تحميل بيانات plan.js + overrides ─────────────────────────────────────────
async function loadPanel() {
    try {
        // جيب قائمة الدول من plan.js
        const planRes = await fetch('/plan/plan.js');
        const planText = await planRes.text();

        // استخرج مصفوفة الـ countries
        const match = planText.match(/const\s+countries\s*=\s*(\[[\s\S]*?\]);/);
        if (!match) throw new Error('plan.js parse error');
        allCountries = JSON.parse(match[1]);

        // جيب الـ overrides من الـ DB
        const ovRes = await fetch(`${API}/country-states`);
        overrides = ovRes.ok ? await ovRes.json() : {};

        renderTable(allCountries);
        updateStats();

    } catch (e) {
        showToast('خطأ في تحميل البيانات');
    } finally {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('admin-email').textContent = adminEmail;
    }
}

// ── حساب حالة الدولة (override يغلب plan.js) ─────────────────────────────────
function isReady(country) {
    if (overrides.hasOwnProperty(country.id)) return overrides[country.id];
    return country.ready !== false;   // plan.js default
}

// ── الجدول ───────────────────────────────────────────────────────────────────
const continentNames = {
    asia: 'آسيا', africa: 'أفريقيا', europe: 'أوروبا',
    north_america: 'أمريكا الشمالية', south_america: 'أمريكا الجنوبية',
    oceania: 'أوقيانوسيا'
};

function renderTable(list) {
    const tbody = document.querySelector('#countries-table tbody');
    tbody.innerHTML = '';

    list.forEach(c => {
        const ready = isReady(c);
        const tr = document.createElement('tr');
        tr.dataset.id = c.id;
        tr.innerHTML = `
            <td>${c.nameAr || '—'}</td>
            <td style="direction:ltr;text-align:right">${c.nameEn || c.id}</td>
            <td><span class="continent-badge">${continentNames[c.continent] || c.continent}</span></td>
            <td>
                <button class="toggle-btn ${ready ? 'ready' : 'not-ready'}"
                        onclick="toggleCountry('${c.id}', this)">
                    ${ready ? '✅ متاح' : '⏳ قريباً'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ── Toggle ────────────────────────────────────────────────────────────────────
async function toggleCountry(countryId, btn) {
    const newReady = btn.classList.contains('not-ready');   // نعكس الحالة
    btn.disabled = true;

    try {
        const res = await fetch(`${API}/admin/toggle-country`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: countryId, ready: newReady, email: adminEmail })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'خطأ');
        }

        // حدّث الـ override محلياً
        overrides[countryId] = newReady;

        // حدّث الزر
        btn.className = `toggle-btn ${newReady ? 'ready' : 'not-ready'}`;
        btn.textContent = newReady ? '✅ متاح' : '⏳ قريباً';

        updateStats();
        showToast(newReady ? `✅ ${countryId} — تم تفعيلها` : `⏳ ${countryId} — تم إخفاؤها`);

    } catch (e) {
        showToast('❌ ' + e.message);
    } finally {
        btn.disabled = false;
    }
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function updateStats() {
    const total  = allCountries.length;
    const ready  = allCountries.filter(c => isReady(c)).length;
    const hidden = total - ready;
    document.getElementById('stat-total').textContent  = total;
    document.getElementById('stat-ready').textContent  = ready;
    document.getElementById('stat-hidden').textContent = hidden;
}

// ── بحث وفلتر ─────────────────────────────────────────────────────────────────
document.getElementById('search-input').addEventListener('input', applyFilter);
document.getElementById('filter-select').addEventListener('change', applyFilter);

function applyFilter() {
    const q      = document.getElementById('search-input').value.trim().toLowerCase();
    const filter = document.getElementById('filter-select').value;   // all | ready | not-ready

    const filtered = allCountries.filter(c => {
        const nameMatch = (c.nameAr || '').includes(q) || (c.nameEn || c.id).toLowerCase().includes(q);
        const ready = isReady(c);
        const stateMatch = filter === 'all' || (filter === 'ready' ? ready : !ready);
        return nameMatch && stateMatch;
    });

    renderTable(filtered);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', checkAdmin);
