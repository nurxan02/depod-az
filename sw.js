const CACHE_NAME = "depod-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/powerbank.html",
  "/earphone.html",
  "/car-charger.html",
  "/css/style.css",
  "/js/main.js",
  "/favicon/favicon.svg",
  "/favicon/favicon-96x96.png",
  "/favicon/apple-touch-icon.png",
  "/image/material/earphone/png/peak-black.png",
  "/image/material/earphone/png/peak-beige.png",
  "/image/material/earphone/powerpack-15w-white-perspective.jpg",
  "/image/material/earphone/car-15w.jpg",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
