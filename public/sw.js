/*
  Hotels Vendors — Service Worker
  Strategy:
  - Static assets: Stale-While-Revalidate
  - API calls: Network-First
  - Navigation: Network-First → Cache → Offline fallback
*/

const STATIC_CACHE = "hv-static-v1";
const API_CACHE = "hv-api-v1";
const IMAGE_CACHE = "hv-images-v1";
const OFFLINE_PAGE = "/offline";

const PRECACHE_URLS = [
  "/",
  "/login",
  "/hotel",
  "/hotel/catalog",
  OFFLINE_PAGE,
];

// ─── Install ───
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ───
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, API_CACHE, IMAGE_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ───
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // 1. API calls → Network-First
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // 2. Static Next.js assets → Stale-While-Revalidate
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/css/") ||
    url.pathname.startsWith("/_next/data/")
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // 3. Images → Stale-While-Revalidate
  if (/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // 4. Navigation (HTML pages) → Network-First with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }
});

// ─── Strategies ───

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    // Return offline fallback page
    const offline = await cache.match(OFFLINE_PAGE);
    if (offline) return offline;

    // Ultimate fallback
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Offline</title></head>
<body style="background:#121212;color:#fff;font-family:sans-serif;text-align:center;padding-top:20vh;">
<h1>You are offline</h1>
<p>Please check your internet connection and try again.</p>
</body></html>`,
      {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
