const CACHE_NAME = "geo-pwa-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", function(event) {
  console.log("[Service Worker] Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("[Service Worker] Caching files");
      return Promise.all(
        urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.error(`[Service Worker] Failed to cache ${url}:`, err);
          })
        )
      );
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("[Service Worker] Activated");

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Optional: keep fetch handler for cache falling back to network
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
// final
