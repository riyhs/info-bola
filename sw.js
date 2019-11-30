const CACHE_NAME = "info-bola-cache-v-9.0.18";
var urlsToCache = [
    "/",
    "/index.html",
    "/nav.html",
    "/manifest.json",
    "/pages/home.html",
    "/pages/rank.html",
    "/assets/css/materialize.min.css",
    "/assets/css/style.css",
    "/assets/js/materialize.min.js",
    "/assets/js/nav.js",
    "/assets/js/script.js",
    "/assets/img/ball.png",
    "/assets/img/logo-512.png",
    "/assets/img/logo-192.png",
    "/assets/img/soccer.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

// use cache
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches
        .match(event.request, {
            cacheName: CACHE_NAME
        })
        .then(function (response) {
            if (response) {
                console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                return response;
            }

            console.log(
                "ServiceWorker: Memuat aset dari server: ",
                event.request.url
            );
            return fetch(event.request);
        })
    );
});

// delete cache 
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});