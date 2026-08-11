/**
 * HotelsVendors Service Worker — network-first (stale content is the enemy).
 *
 * WHY network-first: a cache-first SW (as was used before, "wasla-v5") served
 * stale HTML/CSS/JS indefinitely after the first load, so users kept seeing an
 * old version of the app long after new builds deployed. Navigation always
 * hits the network and falls back to the cache only when offline. Sub-resources
 * (CSS/JS/fonts) are managed with a short-lived runtime cache, never a stale
 * immutable shell.
 *
 * To bust an existing old SW: bump CACHE_VERSION and the file contents —
 * activating this new script calls skipWaiting() + clients.claim() and deletes
 * every previous cache bucket.
 */

const CACHE_VERSION = "hv-network-first-v6";
const SHELL = ["/", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => {})
  );
  // Take control of open tabs immediately so the new strategy applies now,
  // not after the next reload.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_VERSION)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GETs.
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Navigations (HTML pages): network-first, cache fallback for offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Cache a copy of successful navigations for offline use.
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((r) => r || caches.match("/"))
        )
    );
    return;
  }

  // Sub-resources (JS/CSS/fonts): network-first with a short runtime cache.
  // Always prefer the fresh build; use the cache only when offline.
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
