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
        initEditor();

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

// ═══════════════════════════════════════════════════════════════════════════
// ✏️  CONTENT EDITOR
// ═══════════════════════════════════════════════════════════════════════════

let editorData = { countries: [], events: [], recipes: [], cities: [] };
let editingItem = null;   // { type, id, data }
let editorLoaded = { countries: false, events: false, recipes: false, cities: false };

// ── تبويبات المحرر ────────────────────────────────────────────────────────
document.querySelectorAll('.editor-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.editor-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.editor-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.editorTab;
        document.getElementById('editor-' + tab).classList.add('active');
        if (!editorLoaded[tab]) loadEditorTab(tab);
    });
});

// ── تحميل بيانات كل تبويب ────────────────────────────────────────────────
async function loadEditorTab(tab) {
    editorLoaded[tab] = true;
    try {
        if (tab === 'countries') {
            // من allCountries الموجودة بالفعل
            editorData.countries = allCountries.map(c => ({
                id:      c.id,
                name:    c.nameAr || c.id,
                nameEn:  c.nameEn || '',
                img:     c.img || '',
                link:    `/countries/country/${c.continent}/${c.id}.html`
            }));
            renderEditorList('countries');

        } else if (tab === 'events') {
            const html = await (await fetch('/events/events.html')).text();
            const doc  = new DOMParser().parseFromString(html, 'text/html');
            editorData.events = [...doc.querySelectorAll('.event-item')].map(btn => ({
                id:          btn.closest('.event-card')?.id || '',
                name:        btn.dataset.title || '',
                img:         btn.dataset.img   || '',
                country:     btn.dataset.country || '',
                date:        btn.dataset.date   || '',
                desc:        btn.dataset.desc   || '',
                location:    btn.dataset.location || '',
                duration:    btn.dataset.duration || '',
                weather:     btn.dataset.weather  || '',
                airport:     btn.dataset.airport  || '',
                activities:  btn.dataset.activities || '',
                hotelPrice:  btn.dataset.hotelPrice || '',
                total:       btn.dataset.total  || ''
            })).filter(e => e.id);
            renderEditorList('events');

        } else if (tab === 'recipes') {
            const html = await (await fetch('/recipes/recipes.html')).text();
            const doc  = new DOMParser().parseFromString(html, 'text/html');
            editorData.recipes = [...doc.querySelectorAll('.foods-card')].map(card => {
                const btn = card.querySelector('.recipes-item');
                return {
                    id:          card.id || '',
                    name:        btn?.dataset.title || '',
                    img:         btn?.dataset.img   || '',
                    country:     card.dataset.country || '',
                    ingredients: btn?.dataset.ingredients || '',
                    spices:      btn?.dataset.spices || '',
                    sauces:      btn?.dataset.sauces || '',
                    steps:       btn?.dataset.steps  || ''
                };
            }).filter(r => r.id);
            renderEditorList('recipes');

        } else if (tab === 'cities') {
            // جيب المدن من كل صفحات الدول
            const cities = [];
            for (const c of allCountries) {
                if (c.ready === false) continue;
                try {
                    const url  = `/countries/country/${c.continent}/${c.id}.html`;
                    const html = await (await fetch(url)).text();
                    const doc  = new DOMParser().parseFromString(html, 'text/html');
                    doc.querySelectorAll('.cite').forEach(cite => {
                        cities.push({
                            id:          `${c.id}_${cite.dataset.name?.replace(/\s/g,'_')}`,
                            name:        cite.dataset.name     || '',
                            country:     c.nameAr || c.id,
                            countryId:   c.id,
                            continent:   c.continent,
                            img:         cite.dataset.img      || '',
                            desc:        cite.dataset.desc     || '',
                            historic:    cite.dataset.historic || '',
                            restaurants: cite.dataset.restaurants || '',
                            cafes:       cite.dataset.cafes    || '',
                            events:      cite.dataset.events   || ''
                        });
                    });
                } catch (_) {}
            }
            editorData.cities = cities;
            renderEditorList('cities');
        }
    } catch (e) {
        document.getElementById('list-' + tab).innerHTML =
            `<div class="editor-loading" style="color:red">خطأ في التحميل: ${e.message}</div>`;
    }
}

// تحميل مدن كل الدول بشكل أسرع (يشتغل في الخلفية بعد تحميل اللوحة)
async function preloadCities() {
    if (editorLoaded.cities) return;
    editorLoaded.cities = true;
    const cities = [];
    const proms = allCountries.filter(c => c.ready !== false).map(async c => {
        try {
            const url  = `/countries/country/${c.continent}/${c.id}.html`;
            const html = await (await fetch(url)).text();
            const doc  = new DOMParser().parseFromString(html, 'text/html');
            doc.querySelectorAll('.cite').forEach(cite => {
                cities.push({
                    id:          `${c.id}__${(cite.dataset.name||'').replace(/\s+/g,'_')}`,
                    name:        cite.dataset.name     || '',
                    country:     c.nameAr || c.id,
                    countryId:   c.id,
                    continent:   c.continent,
                    img:         cite.dataset.img      || '',
                    desc:        cite.dataset.desc     || '',
                    historic:    cite.dataset.historic || '',
                    restaurants: cite.dataset.restaurants || '',
                    cafes:       cite.dataset.cafes    || '',
                    events:      cite.dataset.events   || ''
                });
            });
        } catch (_) {}
    });
    await Promise.allSettled(proms);
    editorData.cities = cities;
    if (document.getElementById('editor-cities').classList.contains('active')) {
        renderEditorList('cities');
    }
}

// ── رسم قائمة الكروت ─────────────────────────────────────────────────────
const EDITOR_DISPLAY = {
    countries: item => `${item.name} <small style="color:var(--muted)">${item.nameEn}</small>`,
    events:    item => `${item.name} <small style="color:var(--muted)">${item.country}</small>`,
    recipes:   item => `${item.name} <small style="color:var(--muted)">${item.country}</small>`,
    cities:    item => `${item.name} <small style="color:var(--muted)">${item.country}</small>`
};

function renderEditorList(type) {
    const container = document.getElementById('list-' + type);
    const q = (document.getElementById('search-editor-' + type)?.value || '').trim().toLowerCase();
    const list = editorData[type].filter(item =>
        (item.name || '').toLowerCase().includes(q) ||
        (item.nameEn || '').toLowerCase().includes(q) ||
        (item.country || '').includes(q)
    );

    if (!list.length) {
        container.innerHTML = '<div class="editor-loading">لا توجد نتائج</div>';
        return;
    }

    container.innerHTML = list.map((item, idx) => `
        <div class="editor-item" data-type="${type}" data-idx="${editorData[type].indexOf(item)}">
            ${item.img ? `<img src="${item.img}" class="editor-item-img" onerror="this.style.display='none'">` : '<div class="editor-item-img-placeholder">📷</div>'}
            <span class="editor-item-name">${EDITOR_DISPLAY[type](item)}</span>
            <button class="edit-item-btn" onclick="openEditModal('${type}', ${editorData[type].indexOf(item)})">تعديل ✏️</button>
        </div>
    `).join('');
}

function filterEditorList(type) { renderEditorList(type); }

// ── فتح Modal التعديل ─────────────────────────────────────────────────────
const FIELD_DEFS = {
    countries: [
        { key: 'name',   label: 'الاسم العربي',  type: 'text' },
        { key: 'nameEn', label: 'الاسم الإنجليزي', type: 'text' },
        { key: 'img',    label: 'رابط الصورة',    type: 'url' },
        { key: 'link',   label: 'رابط الصفحة',    type: 'text' }
    ],
    events: [
        { key: 'name',        label: 'الاسم',         type: 'text' },
        { key: 'img',         label: 'رابط الصورة',   type: 'url' },
        { key: 'desc',        label: 'الوصف',         type: 'textarea' },
        { key: 'date',        label: 'التاريخ',        type: 'text' },
        { key: 'location',    label: 'الموقع',         type: 'text' },
        { key: 'duration',    label: 'المدة',          type: 'text' },
        { key: 'weather',     label: 'الطقس',          type: 'text' },
        { key: 'airport',     label: 'المطار',         type: 'text' },
        { key: 'activities',  label: 'الأنشطة (pipe-separated)', type: 'textarea' },
        { key: 'hotelPrice',  label: 'سعر الفنادق',   type: 'text' },
        { key: 'total',       label: 'التكلفة الكلية', type: 'text' }
    ],
    recipes: [
        { key: 'name',        label: 'الاسم',          type: 'text' },
        { key: 'img',         label: 'رابط الصورة',    type: 'url' },
        { key: 'country',     label: 'الدولة',         type: 'text' },
        { key: 'ingredients', label: 'المكونات (name|qty|unit|...)', type: 'textarea' },
        { key: 'spices',      label: 'البهارات (name|qty|unit|...)', type: 'textarea' },
        { key: 'sauces',      label: 'الصوصات',        type: 'textarea' },
        { key: 'steps',       label: 'الخطوات (pipe-separated)', type: 'textarea' }
    ],
    cities: [
        { key: 'name',        label: 'الاسم',                   type: 'text' },
        { key: 'img',         label: 'رابط الصورة',             type: 'url' },
        { key: 'desc',        label: 'الوصف',                   type: 'textarea' },
        { key: 'historic',    label: 'المعالم التاريخية (pipe)', type: 'textarea' },
        { key: 'restaurants', label: 'المطاعم (pipe)',           type: 'textarea' },
        { key: 'cafes',       label: 'المقاهي (pipe)',           type: 'textarea' },
        { key: 'events',      label: 'الفعاليات (pipe)',         type: 'textarea' }
    ]
};

function openEditModal(type, idx) {
    const item    = editorData[type][idx];
    const fields  = FIELD_DEFS[type];
    const titles  = { countries: 'دولة', events: 'فعالية', recipes: 'وصفة', cities: 'مدينة' };

    editingItem = { type, idx, item };

    document.getElementById('edit-modal-title').textContent = `✏️ تعديل ${titles[type]}: ${item.name || item.id}`;

    document.getElementById('edit-modal-fields').innerHTML = fields.map(f => `
        <div class="modal-field">
            <label class="modal-label">${f.label}</label>
            ${f.type === 'textarea'
                ? `<textarea class="modal-input" id="field-${f.key}" rows="3">${escHtml(item[f.key] || '')}</textarea>`
                : `<input class="modal-input" type="${f.type}" id="field-${f.key}" value="${escHtml(item[f.key] || '')}">`
            }
        </div>
    `).join('');

    document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    editingItem = null;
}

function escHtml(str) {
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── حفظ التعديل ─────────────────────────────────────────────────────────────
async function saveEdit() {
    if (!editingItem) return;
    const { type, idx, item } = editingItem;
    const fields = FIELD_DEFS[type];
    const saveBtn = document.querySelector('.save-edit-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = '…';

    // اجمع القيم المعدّلة
    const updatedFields = {};
    fields.forEach(f => {
        const el = document.getElementById('field-' + f.key);
        if (el) updatedFields[f.key] = el.value.trim();
    });

    try {
        const res = await fetch(`${API}/admin/update-card`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                id:           item.id,
                country_id:   item.countryId || '',
                continent:    item.continent || '',
                fields:       updatedFields,
                admin_email:  adminEmail
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'خطأ في الحفظ');

        // حدّث البيانات المحلية
        Object.assign(editorData[type][idx], updatedFields);
        renderEditorList(type);
        closeEditModal();
        showToast(`✅ تم حفظ ${item.name || item.id}`);

    } catch (e) {
        showToast('❌ ' + e.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 حفظ التعديل';
    }
}

// ── تحميل المدن في الخلفية بعد تحميل اللوحة ─────────────────────────────
// يُستدعى من loadPanel بعد تحميل allCountries
function initEditor() {
    // تحميل الدول فوراً (بيانات موجودة)
    editorLoaded.countries = true;
    editorData.countries = allCountries.map(c => ({
        id: c.id, name: c.nameAr || c.id, nameEn: c.nameEn || '',
        img: c.img || '', link: `/countries/country/${c.continent}/${c.id}.html`
    }));
    renderEditorList('countries');
}
