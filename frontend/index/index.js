// سفرة — الرئيسية
// الصور اللي يغيّرها الأدمن من «صور الموقع» تنطبق على صور أقسام الرئيسية.
(function () {
    const API_BASE = "https://sofrh-1.onrender.com";
    const CACHE_K = "sfr_siteimages_v1";

    function apply(images) {
        if (!images) return;
        document.querySelectorAll("img[data-key]").forEach(function (img) {
            const url = images[img.dataset.key];
            if (url) img.src = url;
        });
    }

    try { apply(JSON.parse(localStorage.getItem(CACHE_K) || "null")); } catch (_) {}

    fetch(API_BASE + "/site-images")
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (images) {
            if (!images) return;
            try { localStorage.setItem(CACHE_K, JSON.stringify(images)); } catch (_) {}
            apply(images);
        })
        .catch(function () {});
})();
