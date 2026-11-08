window.SAFRA_RECIPES_READY = (() => {
    const K = 'sfr_rc_v4';
    try {
        const c = sessionStorage.getItem(K);
        if (c) { window.SAFRA_RECIPES = JSON.parse(c); return Promise.resolve(); }
    } catch(e) {}
    function parse(html) {
        const recs = [];
        const parts = html.split('<div class="foods-card"');
        for (let i = 1; i < parts.length; i++) {
            const s = parts[i];
            const idM      = s.match(/\bid="([^"]+)"/);
            const ctryM    = s.match(/data-country="([^"]+)"/);
            const titM     = s.match(/data-title="([^"]+)"/);
            const imgM     = s.match(/data-img="([^"]+)"/);
            if (!idM || !titM || !imgM) continue;
            recs.push({
                id:      idM[1],
                title:   titM[1],
                img:     imgM[1],
                country: ctryM ? ctryM[1] : ''
            });
        }
        return recs;
    }
    return fetch('/recipes/recipes.html')
        .then(r => r.text())
        .then(html => {
            const recs = parse(html);
            window.SAFRA_RECIPES = recs;
            try { sessionStorage.setItem(K, JSON.stringify(recs)); } catch(e) {}
        })
        .catch(() => { if (!window.SAFRA_RECIPES) window.SAFRA_RECIPES = []; });
})();
