(function () {
  var m = window.location.pathname.match(/\/countries\/country\/asia\/([^/]+)\.html$/);
  if (!m) return;
  var slug = m[1];

  function optimizeCloudinary(url) {
    if (!url || url.indexOf('res.cloudinary.com') === -1) return url;
    return url.replace(
      /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)([^?#]+)/,
      function (_, pre, rest) {
        return pre + 'f_auto,q_auto:good,w_2000,c_limit/' + rest.split('/').pop();
      }
    );
  }

  function applyHero(rawSrc) {
    var el = document.querySelector('.country-name');
    if (!el) return;
    var src = /^https?:\/\//.test(rawSrc) ? rawSrc : new URL(rawSrc, location.origin).href;
    var optimized = optimizeCloudinary(src);
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var overlay = document.createElement('div');
    overlay.style.cssText =
      'position:absolute;top:0;right:0;bottom:0;left:0;z-index:0;' +
      'background:linear-gradient(to bottom,rgba(50,18,122,0.6) 0%,rgba(21,10,53,0.75) 100%),' +
      'url("' + optimized + '") center/cover no-repeat;' +
      'opacity:0;';
    if (!reduced) overlay.style.transition = 'opacity 0.5s ease';

    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.insertBefore(overlay, el.firstChild);

    for (var i = 0; i < el.children.length; i++) {
      var c = el.children[i];
      if (c !== overlay) {
        c.style.position = 'relative';
        c.style.zIndex = '1';
      }
    }

    var img = new Image();
    img.onload = function () { overlay.style.opacity = '1'; };
    img.onerror = function () { el.removeChild(overlay); };
    img.src = optimized;
  }

  function init() {
    fetch('/countries/countries.html', { cache: 'force-cache' })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var path = '/countries/country/asia/' + slug + '.html';
        var cards = doc.querySelectorAll('.country-card');
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          if ((card.getAttribute('onclick') || '').indexOf(path) === -1) continue;
          var imgEl = card.querySelector('img');
          if (!imgEl) return;
          var src = imgEl.getAttribute('src') || '';
          var filename = src.split('/').pop().split('?')[0];
          if (!src || /^soon\.|^placeholder\./i.test(filename)) return;
          applyHero(src);
          return;
        }
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
