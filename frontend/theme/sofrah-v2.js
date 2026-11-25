/* sofrah-v2.js — Animation, navbar enhancement, ghost bg, footer logo */
(function () {
  'use strict';

  /* ── 1. Navbar scroll class ── */
  function initScrolled() {
    var nav = document.querySelector('header.navbar');
    if (!nav) return;
    function check() {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    check();
    window.addEventListener('scroll', check, { passive: true });
  }

  /* ── 2. Move dark-mode-toggle to navbar & replace text with SVG ── */
  function moveDarkToggle() {
    var nav = document.querySelector('header.navbar');
    if (!nav) return;
    var interval = setInterval(function () {
      var btn = document.getElementById('dark-mode-toggle');
      if (!btn) return;
      clearInterval(interval);
      // Replace emoji with SVG moon/sun
      function setIcon() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        btn.innerHTML = isDark
          ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
          : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      }
      setIcon();
      btn.addEventListener('click', function () { setTimeout(setIcon, 50); });
      // Find right-side container
      var authBtns = nav.querySelector('#authButtons, .auth-buttons');
      var userMenu = nav.querySelector('#userMenu, .user-menu');
      var target = authBtns || userMenu;
      if (target) {
        target.insertBefore(btn, target.firstChild);
      } else {
        nav.appendChild(btn);
      }
    }, 50);
  }

  /* ── 3. Rename signup button text ── */
  function renameSignup() {
    var interval = setInterval(function () {
      var btn = document.querySelector('header.navbar .signup');
      if (!btn) return;
      clearInterval(interval);
      btn.textContent = 'ابدأ سفرتك';
    }, 50);
  }

  /* ── 4. Hero layers injection ── */
  var HERO_MAP = {
    'ix-hero':     { img: '/img/Anse Royale Seychelles.jpg', pos: '50% 35%', anim: 'planes' },
    'hero':        null, // resolved per-page below
    'country-name': null, // uses data-hero-img
    'about-hero':  { img: '/img/wadi hadramut.jpeg', pos: 'center', anim: 'none' },
    'hero-open':   { img: '/img/لوسيرن (Lucerne).jpg', pos: 'center', anim: 'planes' },
  };

  var PAGE_HEROES = {
    'countries.html': { img: '/img/Socotra_Island.jpeg', pos: 'center', anim: 'planes' },
    'recipes.html':   { img: '/img/Yemeni Mandi.jpeg', pos: 'center', anim: 'steam' },
    'events.html':    { img: '/img/Hanami.jpg', pos: 'center', anim: 'fireworks' },
  };

  function makeStars() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1440 560');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    var rng = function (s, e) { return Math.random() * (e - s) + s; };
    for (var i = 0; i < 80; i++) {
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', rng(0, 1440).toFixed(1));
      c.setAttribute('cy', rng(0, 560).toFixed(1));
      var r = rng(0.4, 1.4).toFixed(2);
      c.setAttribute('r', r);
      c.setAttribute('fill', '#fff');
      c.setAttribute('opacity', rng(0.4, 0.9).toFixed(2));
      svg.appendChild(c);
    }
    return svg;
  }

  function injectHeroLayers(el, imgSrc, imgPos, animType) {
    if (el.dataset.sfrDone) return;
    el.dataset.sfrDone = '1';

    // 1. bg image
    var img = document.createElement('img');
    img.className = 'sfr-hero-img';
    img.src = imgSrc;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    if (imgPos) img.style.objectPosition = imgPos;
    el.insertBefore(img, el.firstChild);

    // 2. tint
    var tint = document.createElement('div');
    tint.className = 'sfr-hero-tint';
    el.insertBefore(tint, el.children[1]);

    // 3. stars
    var stars = document.createElement('div');
    stars.className = 'sfr-hero-stars';
    stars.appendChild(makeStars());
    el.insertBefore(stars, el.children[2]);

    // 4. bottom fade
    var fade = document.createElement('div');
    fade.className = 'sfr-hero-fade';
    el.insertBefore(fade, el.children[3]);

    // 5. animation layer
    var anim = document.createElement('div');
    anim.className = 'sfr-hero-anim';
    el.insertBefore(anim, el.children[4]);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (animType === 'planes') injectPlanes(anim);
    else if (animType === 'steam') injectSteam(anim);
    else if (animType === 'fireworks') injectFireworks(anim);
  }

  /* ── 5. Planes ── */
  var PLANE_SHAPES = {
    liner: {
      vb: '0 0 64 24', ratio: 2.6, hasLed: true,
      d: '<path d="M2 13 C2 10 6 8.5 11 8.5 L48 8.5 L56 1.5 L61 1.5 L57 9 L62 10.5 L62 13.5 L11 15.5 C6 15.5 2 15 2 13 Z" fill="var(--plane)"/><path d="M24 12.5 L39 22 L44 22 L35 12.5 Z" fill="var(--plane)"/><path d="M52 10 L58 6 L60 6 L56 11 Z" fill="var(--plane)" opacity=".6"/><g fill="var(--plane-win)"><circle cx="16" cy="11.2" r=".9"/><circle cx="19" cy="11.2" r=".9"/><circle cx="22" cy="11.2" r=".9"/><circle cx="25" cy="11.2" r=".9"/><circle cx="28" cy="11.2" r=".9"/><circle cx="31" cy="11.2" r=".9"/><circle cx="34" cy="11.2" r=".9"/><circle cx="37" cy="11.2" r=".9"/><circle cx="40" cy="11.2" r=".9"/></g>'
    },
    jet: {
      vb: '0 0 24 24', ratio: 1.0, hasLed: true,
      d: '<g transform="rotate(-90 12 12)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="var(--plane)"/></g>'
    },
    prop: {
      vb: '0 0 48 24', ratio: 1.9, hasLed: true,
      d: '<path d="M6 12 C6 9.5 9 8.5 13 8.5 L36 9.5 L42 3 L46 3 L43 10.5 L46 12 L46 14 L13 15.5 C9 15.5 6 14.5 6 12 Z" fill="var(--plane)"/><path d="M17 12 L13 21 L17 21 L24 12 Z" fill="var(--plane)"/><path d="M15 9 L19 5 L25 5 L24 9 Z" fill="var(--plane-win)"/><rect x="4" y="11" width="3" height="2" rx="1" fill="var(--plane)"/><ellipse class="propel" cx="4" cy="12" rx="1.2" ry="7" fill="var(--plane)" opacity=".7"/>'
    },
    paper: {
      vb: '0 0 48 28', ratio: 1.7, hasLed: false,
      d: '<path d="M2 14 L46 2 L32 26 L24 18 Z" fill="var(--plane)"/><path d="M2 14 L46 2 L24 18 Z" fill="var(--plane-win)" opacity=".55"/><path d="M24 18 L26 25 L32 26 Z" fill="var(--plane)" opacity=".75"/>'
    }
  };

  var FLEET = [
    { top: 90, h: 30, dur: 46, del: 10, trail: 280, op: 1,    shape: 'liner' },
    { top: 170, h: 26, dur: 40, del: 30, trail: 220, op: .95, shape: 'jet'   },
    { top: 250, h: 20, dur: 70, del: 48, trail: 120, op: .85, shape: 'prop'  },
    { top: 60,  h: 18, dur: 58, del: 20, trail: 60,  op: .8,  shape: 'paper' },
    { top: 320, h: 16, dur: 84, del: 64, trail: 160, op: .7,  shape: 'jet'   },
  ];

  function injectPlanes(container) {
    FLEET.forEach(function (p) {
      var shape = PLANE_SHAPES[p.shape];
      var w = p.h * shape.ratio;
      var wrap = document.createElement('div');
      wrap.className = 'plane';
      wrap.style.cssText = 'top:' + p.top + 'px;opacity:' + p.op + ';animation-duration:' + p.dur + 's;animation-delay:-' + p.del + 's';

      var trail = document.createElement('div');
      trail.className = 'trail';
      trail.style.width = p.trail + 'px';

      var inner = document.createElement('div');
      inner.className = 'in';
      inner.style.cssText = 'animation-duration:' + (5 + Math.random() * 3).toFixed(1) + 's';

      var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgEl.setAttribute('viewBox', shape.vb);
      svgEl.setAttribute('width', w.toFixed(0));
      svgEl.setAttribute('height', p.h);
      svgEl.style.fill = 'var(--plane)';
      svgEl.style.filter = 'drop-shadow(0 2px 3px rgba(20,8,60,.22))';
      svgEl.innerHTML = shape.d;

      if (shape.hasLed) {
        var led = document.createElement('div');
        led.className = 'led';
        inner.appendChild(led);
      }

      inner.appendChild(svgEl);
      wrap.appendChild(trail);
      wrap.appendChild(inner);
      container.appendChild(wrap);
    });
  }

  /* ── 6. Steam + spices ── */
  var SPICE_SHAPES = {
    card: '<svg viewBox="0 0 40 40" style="width:100%;height:100%"><g transform="rotate(-35 20 20)"><ellipse cx="20" cy="20" rx="8" ry="15" fill="var(--plane)"/><path d="M20 6 C 17 14 17 26 20 34" fill="none" stroke="var(--plane-win)" stroke-width="1.3" opacity=".7"/><path d="M20 5 L20 2" stroke="var(--plane-win)" stroke-width="1.8" stroke-linecap="round"/></g></svg>',
    cin:  '<svg viewBox="0 0 40 40" style="width:100%;height:100%"><g transform="rotate(25 20 20)"><rect x="6" y="14" width="28" height="12" rx="5" fill="var(--plane)"/><path d="M10 14 v12 M15 14 v12" stroke="var(--plane-win)" stroke-width="1" opacity=".45"/><circle cx="31" cy="20" r="5.5" fill="var(--plane)"/><path d="M31 20 m-2.5 0 a2.5 2.5 0 1 1 2.5 2.5" fill="none" stroke="var(--plane-win)" stroke-width="1.3"/></g></svg>',
    bay:  '<svg viewBox="0 0 40 40" style="width:100%;height:100%"><g transform="rotate(-20 20 20)"><path d="M20 3 C 31 12 31 28 20 37 C 9 28 9 12 20 3 Z" fill="var(--plane)"/><path d="M20 6 V36 M20 14 L26 10 M20 20 L27 16 M20 26 L26 23 M20 14 L14 10 M20 20 L13 16 M20 26 L14 23" fill="none" stroke="var(--plane-win)" stroke-width="1.1" opacity=".6"/></g></svg>',
    star: '<svg viewBox="0 0 40 40" style="width:100%;height:100%"><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(0 20 20)" fill="var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(45 20 20)" fill="var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(90 20 20)" fill="var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(135 20 20)" fill="var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(180 20 20)" fill="var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(225 20 20)" fill="var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(270 20 20)" fill="var(--plane)"/><ellipse cx="20" cy="10" rx="4.2" ry="9" transform="rotate(315 20 20)" fill="var(--plane)"/><circle cx="20" cy="20" r="4" fill="var(--plane-win)"/></svg>',
    chili:'<svg viewBox="0 0 40 40" style="width:100%;height:100%"><path d="M12 9 C 10 20 18 31 33 34 C 27 27 22 18 20 9 C 18 6 14 6 12 9 Z" fill="var(--plane)"/><path d="M15 8 C 15 5 17 3 20 3" fill="none" stroke="var(--plane)" stroke-width="2.6" stroke-linecap="round"/><path d="M15 14 C 16 20 20 25 25 28" fill="none" stroke="var(--plane-win)" stroke-width="1.6" stroke-linecap="round"/></svg>'
  };

  var SPICES = [
    { left: '6%',  sz: 40, dur: 18, del: 0,  shape: 'card'  },
    { left: '16%', sz: 32, dur: 22, del: 8,  shape: 'cin'   },
    { left: '32%', sz: 44, dur: 19, del: 3,  shape: 'bay'   },
    { left: '58%', sz: 34, dur: 23, del: 12, shape: 'star'  },
    { left: '72%', sz: 42, dur: 20, del: 6,  shape: 'chili' },
    { left: '90%', sz: 34, dur: 21, del: 15, shape: 'bay'   },
  ];

  function injectSteam(container) {
    // Steam lines
    [['10%', 6, 0], ['16%', 7.5, 1.5], ['23%', 6.5, 3]].forEach(function (s) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.className.baseVal = 'steam';
      el.setAttribute('viewBox', '0 0 60 200');
      el.style.left = s[0];
      el.style.animationDuration = s[1] + 's';
      el.style.animationDelay = '-' + s[2] + 's';
      el.innerHTML = '<path d="M30 200 C 10 160 50 130 30 95 C 12 62 48 38 30 0" fill="none" stroke="var(--steam)" stroke-width="14" stroke-linecap="round" style="filter:blur(5px)"/>';
      container.appendChild(el);
    });
    // Spices
    SPICES.forEach(function (s) {
      var el = document.createElement('div');
      el.className = 'spice2';
      el.style.cssText = 'left:' + s.left + ';width:' + s.sz + 'px;height:' + s.sz + 'px;animation-duration:' + s.dur + 's;animation-delay:-' + s.del + 's';
      el.innerHTML = SPICE_SHAPES[s.shape];
      container.appendChild(el);
    });
  }

  /* ── 7. Fireworks + lanterns ── */
  function makeBurst(colors) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 170 170');
    for (var i = 0; i < 16; i++) {
      var angle = i * 22.5;
      var rad = angle * Math.PI / 180;
      var x2 = (85 + Math.cos(rad) * 70).toFixed(2);
      var y2 = (85 + Math.sin(rad) * 70).toFixed(2);
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '85'); line.setAttribute('y1', '85');
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      line.setAttribute('stroke', colors[i % 2]);
      line.setAttribute('stroke-width', '3.2');
      line.setAttribute('stroke-dasharray', '2 9');
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
    }
    return svg;
  }

  var BURSTS = [
    { left: '10%', top: 90,  dur: 4.5, del: 0   },
    { left: '24%', top: 170, dur: 5,   del: 2.2 },
    { left: '70%', top: 70,  dur: 4.2, del: 1.1 },
    { left: '84%', top: 150, dur: 5.4, del: 3.3 },
    { left: '48%', top: 40,  dur: 4.8, del: 3.9 },
  ];

  var LANTERNS = [
    { left: '6%',  dur: 14, del: 0  },
    { left: '17%', dur: 18, del: 6  },
    { left: '29%', dur: 15, del: 10 },
    { left: '63%', dur: 17, del: 3  },
    { left: '77%', dur: 13, del: 8  },
    { left: '90%', dur: 16, del: 12 },
  ];

  function injectFireworks(container) {
    BURSTS.forEach(function (b) {
      var el = document.createElement('div');
      el.className = 'burst';
      el.style.cssText = 'left:' + b.left + ';top:' + b.top + 'px;animation-duration:' + b.dur + 's;animation-delay:-' + b.del + 's';
      el.appendChild(makeBurst(['var(--fx-a)', 'var(--fx-b)']));
      container.appendChild(el);
    });
    LANTERNS.forEach(function (l) {
      var el = document.createElement('div');
      el.className = 'lantern';
      el.style.cssText = 'left:' + l.left + ';animation-duration:' + l.dur + 's;animation-delay:-' + l.del + 's';
      container.appendChild(el);
    });
  }

  /* ── 8. Init hero for current page ── */
  function initHero() {
    var page = location.pathname.split('/').pop() || 'index.html';

    // index hero
    var ixHero = document.querySelector('.ix-hero');
    if (ixHero) {
      injectHeroLayers(ixHero, '/img/Anse Royale Seychelles.jpg', '50% 35%', 'planes');
    }

    // .hero (countries, recipes, events)
    var hero = document.querySelector('section.hero');
    if (hero) {
      var cfg = PAGE_HEROES[page];
      if (!cfg) {
        // try parent folder name
        var parts = location.pathname.split('/');
        var folderPage = parts[parts.length - 2] + '.html';
        cfg = PAGE_HEROES[folderPage];
      }
      if (cfg) injectHeroLayers(hero, cfg.img, cfg.pos, cfg.anim);
    }

    // country page .country-name
    var cname = document.querySelector('.country-name');
    if (cname) {
      var heroImg = cname.dataset.heroImg || cname.getAttribute('data-hero-img') || '';
      if (heroImg) injectHeroLayers(cname, heroImg, 'center', 'planes');
    }

    // about
    var aHero = document.querySelector('.about-hero');
    if (aHero) injectHeroLayers(aHero, '/img/wadi hadramut.jpeg', 'center', 'none');

    // plan
    var pHero = document.querySelector('.hero-open');
    if (pHero) injectHeroLayers(pHero, '/img/لوسيرن (Lucerne).jpg', 'center', 'planes');

    // profile — inject short hero
    var sideMenu = document.getElementById('side-menu');
    if (sideMenu && document.querySelector('.profile-sidebar, .profile-container, [class*="profile"]')) {
      var ph = document.createElement('div');
      ph.className = 'sfr-hero sfr-hero-short';
      var pImg = document.createElement('img');
      pImg.className = 'sfr-hero-img';
      pImg.src = '/img/Anse Source d’Argent.jpg';
      pImg.alt = '';
      pImg.setAttribute('aria-hidden', 'true');
      var pTint = document.createElement('div');
      pTint.className = 'sfr-hero-tint';
      ph.appendChild(pImg);
      ph.appendChild(pTint);
      sideMenu.parentNode.insertBefore(ph, sideMenu.nextSibling);
    }

    // admin — inject gradient banner
    var adminMain = document.querySelector('.admin-main, main.admin, [class*="admin-content"], #adminPanel');
    if (adminMain && location.pathname.includes('admin')) {
      var ah = document.createElement('div');
      ah.className = 'sfr-admin-hero';
      var blob = document.createElement('div');
      blob.className = 'sfr-admin-blob';
      var aAnim = document.createElement('div');
      aAnim.className = 'sfr-hero-anim';
      var aH1 = document.createElement('h1');
      aH1.style.cssText = 'position:relative;z-index:2;color:#fff';
      aH1.textContent = 'لوحة التحكم';
      ah.appendChild(blob);
      ah.appendChild(aAnim);
      ah.appendChild(aH1);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) injectPlanes(aAnim);
      adminMain.insertBefore(ah, adminMain.firstChild);
    }

    // auth pages
    var authPage = document.querySelector('.auth-page');
    if (authPage) {
      injectHeroLayers(authPage, '/img/Mitsamiouli.jpg', 'center', 'none');
    }
  }

  /* ── 9. Footer logo ── */
  function initFooterLogo() {
    var fl = document.querySelector('h2.footer-logo, .footer-logo');
    if (!fl) return;
    var img = document.createElement('img');
    img.src = 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/logo-img.PNG';
    img.alt = 'سفرة';
    img.className = 'sfr-footer-logo';
    fl.replaceWith(img);
  }

  /* ── 10. Ghost background ── */
  function initGhost() {
    var ghost = document.getElementById('sfr-ghost');
    if (!ghost) {
      ghost = document.createElement('div');
      ghost.id = 'sfr-ghost';
      ghost.innerHTML = '<img src="" alt="" aria-hidden="true">';
      document.body.appendChild(ghost);
    }
    var ghostImg = ghost.querySelector('img');

    function showGhost(src) {
      if (!src) return;
      ghostImg.style.opacity = '0';
      ghostImg.style.transform = 'scale(1.04)';
      ghostImg.style.transition = 'opacity .7s ease, transform .7s ease';
      ghostImg.src = src;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          ghostImg.style.opacity = '';
          ghostImg.style.transform = 'scale(1)';
        });
      });
    }

    document.addEventListener('click', function (e) {
      var ri = e.target.closest('.recipes-item');
      var ei = e.target.closest('.event-item');
      var ci = e.target.closest('.cite');
      var el = ri || ei || ci;
      if (!el) return;
      var src = el.dataset.img || '';
      if (src) showGhost(src);
    }, true);
  }

  /* ── 11. CTA logo watermark ── */
  function initCtaLogo() {
    var cta = document.querySelector('.ix-cta, .ix-cta-inner');
    if (!cta) return;
    if (cta.querySelector('.ix-cta-logo-bg')) return;
    var bg = document.createElement('img');
    bg.className = 'ix-cta-logo-bg';
    bg.src = 'https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/logo-img.PNG';
    bg.alt = '';
    bg.setAttribute('aria-hidden', 'true');
    bg.style.cssText = 'position:absolute;bottom:-20px;left:-10px;height:160px;opacity:.06;pointer-events:none;filter:brightness(0) invert(1)';
    cta.style.position = 'relative';
    cta.appendChild(bg);
  }

  /* ── Boot ── */
  function boot() {
    initScrolled();
    moveDarkToggle();
    renameSignup();
    initHero();
    initFooterLogo();
    initGhost();
    initCtaLogo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
