window.SAFRA_EVENTS_READY = (() => {
    const K = 'sfr_ev_v4';
    try {
        const c = sessionStorage.getItem(K);
        if (c) { window.SAFRA_EVENTS = JSON.parse(c); return Promise.resolve(); }
    } catch(e) {}
    function parse(html) {
        const evs = [];
        const parts = html.split('<div class="event-card"');
        for (let i = 1; i < parts.length; i++) {
            const s = parts[i];
            const idM   = s.match(/\bid="([^"]+)"/);
            const titM  = s.match(/data-title="([^"]+)"/);
            const imgM  = s.match(/data-img="([^"]+)"/);
            const dateM = s.match(/data-date="([^"]+)"/);
            const locM  = s.match(/data-location="([^"]+)"/);
            if (!idM || !titM || !imgM) continue;
            evs.push({
                id:       idM[1],
                title:    titM[1],
                img:      imgM[1],
                date:     dateM ? dateM[1].replace(/^📅\s*/, '') : '',
                location: locM  ? locM[1] : ''
            });
        }
        return evs;
    }
    return fetch('/events/events.html')
        .then(r => r.text())
        .then(html => {
            const evs = parse(html);
            window.SAFRA_EVENTS = evs;
            try { sessionStorage.setItem(K, JSON.stringify(evs)); } catch(e) {}
        })
        .catch(() => { if (!window.SAFRA_EVENTS) window.SAFRA_EVENTS = []; });
})();
