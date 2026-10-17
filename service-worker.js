// Copia de sw.js: sustituye al antiguo service-worker.js para que los móviles con la versión vieja se actualicen.
const VERSION = "plano-v17";
const SHELL = ["/", "/app.js", "/manifest.webmanifest", "/cover.jpg", "/icons/icon-192.png", "/icons/icon-512.png"];
const POSTERS = "plano-posters";
const POSTER_LIMIT = 250;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).catch(() => null));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION && key !== POSTERS).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request.mode === "navigate" ? "/" : request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request.mode === "navigate" ? "/" : request, { ignoreSearch: true });
    if (cached) return cached;
    throw new Error("Sin conexión");
  }
}

async function posterFirst(request) {
  const cache = await caches.open(POSTERS);
  const cached = await cache.match(request.url);
  if (cached) return cached;
  let response;
  try {
    response = await fetch(request.url, { mode: "cors", credentials: "omit" });
  } catch {
    return fetch(request);
  }
  if (response.ok) {
    await cache.put(request, response.clone());
    cache.keys().then((keys) => keys.length > POSTER_LIMIT && Promise.all(keys.slice(0, keys.length - POSTER_LIMIT).map((key) => cache.delete(key))));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    if (url.pathname === "/sw.js" || url.pathname === "/service-worker.js") return;
    if (url.pathname.startsWith("/posters/")) {
      event.respondWith(posterFirst(request));
      return;
    }
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.hostname === "image.tmdb.org") event.respondWith(posterFirst(request));
});
