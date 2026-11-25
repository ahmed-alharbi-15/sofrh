/* سفرة — التصميم الجديد (v2): سلوكيات مشتركة
   - نقل زر الوضع الليلي (اللي ينشئه auth.js) للنافبار + أيقونات
   - النافبار يصير غامق بعد التمرير
   - أنيميشن الهيرو حسب data-anim (planes / recipes / events)
   - صورة شفافة بالخلفية لما تختار وصفة / فعالية / مدينة
   - أكورديون الرئيسية */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function isDark() { return document.documentElement.getAttribute("data-theme") === "dark"; }

  /* ---------- theme toggle ---------- */
  function setupThemeToggle() {
    var btn = document.getElementById("dark-mode-toggle");
    var slot = document.getElementById("sfThemeSlot");
    if (!btn) return false;
    if (slot && btn.parentNode !== slot) slot.appendChild(btn);
    var paint = function () {
      btn.innerHTML = isDark() ? SUN : MOON;
      btn.setAttribute("aria-label", isDark() ? "الوضع النهاري" : "الوضع الليلي");
    };
    paint();
    if (!btn.dataset.sfBound) {
      btn.dataset.sfBound = "1";
      btn.addEventListener("click", function () { setTimeout(paint, 0); });
    }
    return true;
  }

  /* ---------- nav on scroll ---------- */
  function setupNav() {
    var nav = document.getElementById("sfNav");
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

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
    return FLEET.map(function (p) {
      var sh = SHAPES[p[6]], h = p[1], w = Math.round(h * sh[1]);
      var led = p[6] === "paper" ? "" : '<span class="led" style="left:' + (w / 2 - 2) + "px;top:" + (h / 2 - 2) + 'px"></span>';
      return '<div class="sf-plane" style="top:' + p[0] + ";animation-duration:" + p[2] + "s;animation-delay:-" + p[3] + "s;opacity:" + p[5] + '"><div class="in"><svg width="' + w + '" height="' + h + '" viewBox="' + sh[0] + '" aria-hidden="true">' + sh[2] + "</svg>" + led + '<div class="trail" style="width:' + p[4] + 'px"></div></div></div>';
    }).join("");
  }
  function recipesFx() {
    var steam = [[10, 6, 0], [16, 7.5, 3], [23, 6.5, 1.5]].map(function (s) {
      return '<div class="sf-steam" style="left:' + s[0] + "%;animation-duration:" + s[1] + "s;animation-delay:-" + s[2] + 's"><svg viewBox="0 0 60 200" width="60" height="200" aria-hidden="true"><path d="M30 200 C 10 160 50 130 30 95 C 12 62 48 38 30 0" fill="none" stroke-width="14" stroke-linecap="round"/></svg></div>';
    }).join("");
    var seq = ["card", "cin", "bay", "star", "chili", "bay"];
    var sp = [[6, 40, 18, 0], [16, 32, 22, 8], [32, 44, 19, 3], [58, 34, 23, 12], [72, 42, 20, 6], [90, 34, 21, 15]].map(function (s, i) {
      return '<div class="sf-spice" style="left:' + s[0] + "%;width:" + s[1] + "px;height:" + s[1] + "px;animation-duration:" + s[2] + "s;animation-delay:-" + s[3] + 's"><svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">' + SPICES[seq[i]] + "</svg></div>";
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
    var l = [[6, 14, 0], [17, 18, 6], [29, 15, 10], [63, 17, 3], [77, 13, 8], [90, 16, 12]].map(function (s) {
      return '<span class="sf-lantern" style="left:' + s[0] + "%;animation-duration:" + s[1] + "s;animation-delay:-" + s[2] + 's"></span>';
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

  /* ---------- ghost background ---------- */
  function setupGhost() {
    var sel = ".recipes-item, .event-item, .cite";
    document.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest(sel);
      if (!el) return;
      var src = el.getAttribute("data-img") || (el.querySelector("img") && el.querySelector("img").getAttribute("src"));
      if (!src) return;
      var g = document.getElementById("sf-ghost");
      if (!g) { g = document.createElement("div"); g.id = "sf-ghost"; g.setAttribute("aria-hidden", "true"); document.body.prepend(g); }
      g.innerHTML = '<img alt="" src="' + src.replace(/"/g, "&quot;") + '">';
    }, true);
  }

  /* ---------- accordions (home) ---------- */
  function setupAcc() {
    document.querySelectorAll(".sf-acc").forEach(function (acc) {
      acc.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          var open = b.getAttribute("aria-expanded") === "true";
          acc.querySelectorAll("button").forEach(function (o) {
            o.setAttribute("aria-expanded", "false");
            o.querySelector(".pl").textContent = "+";
            var body = document.getElementById(o.getAttribute("aria-controls"));
            if (body) body.hidden = true;
          });
          if (!open) {
            b.setAttribute("aria-expanded", "true");
            b.querySelector(".pl").textContent = "−";
            var body = document.getElementById(b.getAttribute("aria-controls"));
            if (body) body.hidden = false;
          }
        });
      });
    });
  }

  /* ---------- home search: route to the right page ---------- */
  function setupHomeSearch() {
    var f = document.getElementById("sfHomeSearch");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (f.querySelector("input").value || "").trim();
      window.location.href = "/countries/countries.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  }
  function applyQueryToSearch() {
    var q = new URLSearchParams(location.search).get("q");
    var inp = document.getElementById("searchInput");
    if (q && inp) { inp.value = q; inp.dispatchEvent(new Event("input", { bubbles: true })); inp.dispatchEvent(new Event("keyup", { bubbles: true })); }
  }

  function init() {
    setupNav();
    setupHeroFx();
    setupGhost();
    setupAcc();
    setupHomeSearch();
    applyQueryToSearch();
    if (!setupThemeToggle()) {
      var tries = 0, t = setInterval(function () { if (setupThemeToggle() || ++tries > 40) clearInterval(t); }, 50);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
