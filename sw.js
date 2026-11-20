// Offline support.
// App files: network first (so updates show straight away), saved copy when offline.
// Recitation audio and fonts: saved copy first.
const CACHE = 'myqasas-v1';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'art.js', 'stories.js',
  'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-512.png',
  'fonts/fraunces-latin-600-italic.woff2', 'fonts/fraunces-latin-700-italic.woff2',
  'fonts/fraunces-latin-700-normal.woff2', 'fonts/inter-latin-500-normal.woff2',
  'fonts/inter-latin-600-normal.woff2', 'fonts/amiri-quran-arabic-400-normal.woff2',
  'fonts/amiri-arabic-400-normal.woff2'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;  // let audio streaming pass straight through
  const sameOrigin = new URL(req.url).origin === self.location.origin;
  if (sameOrigin) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req.url, { cache: 'no-cache' });
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        return (await cache.match(req, { ignoreSearch: true })) ||
               (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
      }
    })());
  }
});
