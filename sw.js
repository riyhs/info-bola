const CACHE_NAME = "info-bola-cache-v-9.0.24";
var urlsToCache = [
    "/",
    "/index.html",
    "/nav.html",
    "/manifest.json",
    "/pages/home.html",
    "/pages/rank.html",
    "/pages/matches.html",
    "/assets/css/materialize.min.css",
    "/assets/css/style.css",
    "/assets/js/materialize.min.js",
    "/assets/js/nav.js",
    "/assets/js/script.js",
    "/assets/js/api.js",
    "/assets/js/idb.js",
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
        caches.match(event.request, {
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

self.addEventListener("fetch", function (event) {
    var url_peringkat = "https://api.football-data.org/v2/competitions/2021/standings?standingType=TOTAL";

    if (event.request.url.indexOf(url_peringkat) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        )
    }
});

// delete cache 
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME && cacheName.startsWith("info-bola-cache-v")) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});