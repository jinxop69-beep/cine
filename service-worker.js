const CACHE_NAME = 'ollada-pwa-v11-stable-sfix';
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL).catch(()=>null)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin && (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === '/app.html')) {
    event.respondWith(fetch(req).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match('/index.html'))));
    return;
  }

  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (url.origin === location.origin) {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
    }
    return res;
  })));
});