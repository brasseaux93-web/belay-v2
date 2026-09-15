const CACHE = "belay-shell-v1";

const PRECACHE = ["/", "/confirm", "/history", "/manifest.json", "/favicon.svg", "/login"];

// Install: precache the app shell.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

// Activate: remove stale caches.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch strategy:
//   - /_server/* and /api/*  → network-only (Better Auth, server functions)
//   - /assets/*              → cache-first (Vite hashed bundles)
//   - navigation requests    → network-first, fall back to cached shell
//   - everything else        → network-first
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Always bypass the cache for server-side routes.
  if (url.pathname.startsWith("/_server") || url.pathname.startsWith("/api/")) {
    return; // Let the browser handle it normally.
  }

  // Cache-first for Vite hashed assets.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone));
        return res;
      })),
    );
    return;
  }

  // Network-first for navigation and everything else;
  // fall back to the cached root shell so the SPA can handle routing.
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (request.destination === "document") {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request).then((cached) => cached ?? caches.match("/"))),
  );
});
