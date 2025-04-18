const CACHE_NAME = 'travel-pwa-v2';
const FILES_TO_CACHE = ['.', 'index.html', 'style.css', 'app.js', 'manifest.json'];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});
self.addEventListener('activate', evt => evt.waitUntil(self.clients.claim()));
self.addEventListener('fetch', evt => {
  if (evt.request.mode !== 'navigate') return;
  evt.respondWith(fetch(evt.request).catch(() => caches.match('index.html')));
});
