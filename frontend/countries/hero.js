(function () {
  var el = document.querySelector('.country-name');
  if (!el) return;
  var src = el.getAttribute('data-hero-img');
  if (!src) return;

  function pickWidth() {
    var px = (window.innerWidth || 375) * (window.devicePixelRatio || 1);
    return px <= 800 ? 800 : px <= 1280 ? 1280 : 1920;
  }

  function optimizeCloudinary(url, w) {
    if (!url || url.indexOf('res.cloudinary.com') === -1) return url;
    return url.replace(
      /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)([^?#]+)/,
      function (_, pre, rest) {
        return pre + 'f_auto,q_auto:good,w_' + w + ',c_limit/' + rest.split('/').pop();
      }
    );
  }

  var w = pickWidth();
  var fullSrc = optimizeCloudinary(src, w);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var overlay = document.createElement('div');
  overlay.style.cssText =
    'position:absolute;top:0;right:0;bottom:0;left:0;z-index:0;opacity:0;' +
    'background:linear-gradient(to bottom,rgba(50,18,122,0.6) 0%,rgba(21,10,53,0.75) 100%),' +
    'url("' + fullSrc + '") center/cover no-repeat;';
  if (!reduced) overlay.style.transition = 'opacity 0.5s ease';

  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.insertBefore(overlay, el.firstChild);

  for (var i = 1; i < el.children.length; i++) {
    el.children[i].style.position = 'relative';
    el.children[i].style.zIndex = '1';
  }

  var img = new Image();
  img.onload = function () { overlay.style.opacity = '1'; };
  img.onerror = function () { el.removeChild(overlay); };
  img.src = fullSrc;
})();
