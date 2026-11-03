/* Network-first with cache fallback: updates arrive immediately, app works offline. */
const CACHE = 'sienna-v16';
const SHELL = ['./', 'index.html', 'css/style.css', 'js/i18n.js', 'js/data/content.js', 'js/data/reset.js', 'js/storage.js', 'js/data/recipes.js', 'js/data/wellbeing.js', 'js/sections.js', 'js/extras.js', 'js/data/more.js', 'js/data/howto.js', 'js/cycle.js', 'js/app.js', 'manifest.webmanifest', 'icons/symbol.svg', 'fonts/cormorant.ttf', 'fonts/jost.ttf'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
