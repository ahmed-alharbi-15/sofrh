(function () {
    const NAV = [
        {
            group: 'المحتوى',
            items: [
                { id: 'nav-countries-status', label: 'حالة الدول',  icon: '🌍', section: 'section-countries' },
                { id: 'nav-editor-events',    label: 'الفعاليات',   icon: '🎪', section: 'section-editor',    tab: 'events'    },
                { id: 'nav-editor-recipes',   label: 'الوصفات',     icon: '🍽️', section: 'section-editor',    tab: 'recipes'   },
                { id: 'nav-editor-cities',    label: 'المدن',       icon: '🏙️', section: 'section-editor',    tab: 'cities'    },
                { id: 'nav-editor-countries', label: 'تعديل الدول', icon: '✏️', section: 'section-editor',    tab: 'countries' },
            ]
        },
        {
            group: 'الإدارة',
            items: [
                { id: 'nav-users',  label: 'المستخدمون', icon: '👥', section: 'section-users'  },
                { id: 'nav-admins', label: 'الأدمنز',    icon: '🛡️', section: 'section-admins' },
            ]
        }
    ];

    const ALL_SECTIONS = ['section-countries', 'section-editor', 'section-admins', 'section-users'];

    function buildSidebar() {
        const wrap = document.getElementById('admin-sidebar-wrap');
        if (!wrap) return;

        let html = '<div id="admin-sidebar">';
        html += '<div class="sb-search-wrap"><input type="search" id="sb-search" placeholder="بحث سريع…" /></div>';

        NAV.forEach(function (group) {
            html += '<div class="sb-group"><span class="sb-group-label">' + group.group + '</span>';
            group.items.forEach(function (item) {
                html += '<button class="sb-item" id="' + item.id + '" data-section="' + item.section + '"' +
                    (item.tab ? ' data-tab="' + item.tab + '"' : '') + '>' +
                    item.icon + ' ' + item.label + '</button>';
            });
            html += '</div>';
        });

        html += '</div>';
        html += '<button id="sb-toggle" aria-label="القائمة">☰</button>';
        html += '<div id="sb-overlay"></div>';

        wrap.innerHTML = html;
        attachListeners();
        showSection('section-countries', null);
    }

    function showSection(sectionId, tab) {
        ALL_SECTIONS.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.style.display = id === sectionId ? '' : 'none';
        });

        if (tab) {
            var tabBtn = document.querySelector('[data-editor-tab="' + tab + '"]');
            if (tabBtn) tabBtn.click();
        }

        document.querySelectorAll('.sb-item').forEach(function (btn) {
            var match = btn.dataset.section === sectionId &&
                (tab ? btn.dataset.tab === tab : !btn.dataset.tab ||
                    (sectionId !== 'section-editor'));
            btn.classList.toggle('sb-active', match);
        });
    }

    function attachListeners() {
        document.querySelectorAll('.sb-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                showSection(this.dataset.section, this.dataset.tab || null);
                closeSidebar();
            });
        });

        var sbSearch = document.getElementById('sb-search');
        if (sbSearch) {
            sbSearch.addEventListener('input', function () {
                var q = this.value.toLowerCase();
                document.querySelectorAll('.sb-item').forEach(function (btn) {
                    btn.style.display = btn.textContent.trim().toLowerCase().includes(q) ? '' : 'none';
                });
            });
        }

        var toggle = document.getElementById('sb-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                document.getElementById('admin-sidebar').classList.toggle('sb-open');
                document.getElementById('sb-overlay').classList.toggle('sb-overlay-active');
            });
        }

        var overlay = document.getElementById('sb-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }
    }

    function closeSidebar() {
        var sb = document.getElementById('admin-sidebar');
        var ov = document.getElementById('sb-overlay');
        if (sb) sb.classList.remove('sb-open');
        if (ov) ov.classList.remove('sb-overlay-active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildSidebar);
    } else {
        buildSidebar();
    }
})();
