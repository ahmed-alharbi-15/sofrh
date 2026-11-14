(function () {
  var m = window.location.pathname.match(/\/countries\/country\/asia\/([^/]+)\.html$/);
  if (!m) return;
  var slug = m[1];
  var CACHE_KEY = 'sofrah_asia_hero';

  function pickWidth() {
    var px = (window.innerWidth || 375) * (window.devicePixelRatio || 1);
    return px <= 800 ? 800 : px <= 1280 ? 1280 : 1920;
  }

  function optimizeCloudinary(url, w, blur) {
    if (!url || url.indexOf('res.cloudinary.com') === -1) return url;
    var transform = blur
      ? 'w_40,q_10,e_blur:400,c_limit'
      : 'f_auto,q_auto:good,w_' + w + ',c_limit';
    return url.replace(
      /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)([^?#]+)/,
      function (_, pre, rest) {
        return pre + transform + '/' + rest.split('/').pop();
      }
    );
  }

  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; }
  }

  function writeCache(map) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ v: 1, map: map, t: Date.now() })); } catch (e) {}
  }

  function applyHero(rawSrc, overlay) {
    var w = pickWidth();
    var blurSrc = optimizeCloudinary(rawSrc, w, true);
    var fullSrc = optimizeCloudinary(rawSrc, w, false);
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    overlay.style.backgroundImage =
      'linear-gradient(to bottom,rgba(50,18,122,0.6) 0%,rgba(21,10,53,0.75) 100%),' +
      'url("' + blurSrc + '")';
    overlay.style.backgroundSize = 'cover';
    overlay.style.backgroundPosition = 'center';
    overlay.style.backgroundRepeat = 'no-repeat';
    if (!reduced) overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.opacity = '1';

    if (!reduced) {
      var img = new Image();
      img.onload = function () {
        overlay.style.backgroundImage =
          'linear-gradient(to bottom,rgba(50,18,122,0.6) 0%,rgba(21,10,53,0.75) 100%),' +
          'url("' + fullSrc + '")';
      };
      img.src = fullSrc;
    } else {
      overlay.style.backgroundImage =
        'linear-gradient(to bottom,rgba(50,18,122,0.6) 0%,rgba(21,10,53,0.75) 100%),' +
        'url("' + fullSrc + '")';
    }
  }

  function setupOverlay() {
    var el = document.querySelector('.country-name');
    if (!el) return null;
    var overlay = document.createElement('div');
    overlay.style.cssText =
      'position:absolute;top:0;right:0;bottom:0;left:0;z-index:0;opacity:0;' +
      'background-size:cover;background-position:center;background-repeat:no-repeat;';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.insertBefore(overlay, el.firstChild);
    for (var i = 1; i < el.children.length; i++) {
      var c = el.children[i];
      c.style.position = 'relative';
      c.style.zIndex = '1';
    }
    return overlay;
  }

  function extractMap(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var map = {};
    var cards = doc.querySelectorAll('.country-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var onclick = card.getAttribute('onclick') || '';
      var pm = onclick.match(/\/countries\/country\/asia\/([^']+)\.html/);
      if (!pm) continue;
      var imgEl = card.querySelector('img');
      if (!imgEl) continue;
      var src = imgEl.getAttribute('src') || '';
      var filename = src.split('/').pop().split('?')[0];
      if (!src || /^soon\.|^placeholder\./i.test(filename)) continue;
      map[pm[1]] = src;
    }
    return map;
  }

  function revalidate(overlay, shownSrc) {
    fetch('/countries/countries.html', { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var newMap = extractMap(html);
        writeCache(newMap);
        if (overlay && newMap[slug] && newMap[slug] !== shownSrc) {
          applyHero(newMap[slug], overlay);
        }
      })
      .catch(function () {});
  }

  function init() {
    var overlay = setupOverlay();
    if (!overlay) return;

    var cache = readCache();
    if (cache && cache.map && cache.map[slug]) {
      applyHero(cache.map[slug], overlay);
      revalidate(overlay, cache.map[slug]);
    } else {
      fetch('/countries/countries.html', { cache: 'force-cache' })
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var newMap = extractMap(html);
          writeCache(newMap);
          var src = newMap[slug];
          if (src) applyHero(src, overlay);
          else overlay.parentNode && overlay.parentNode.removeChild(overlay);
        })
        .catch(function () { overlay.parentNode && overlay.parentNode.removeChild(overlay); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
