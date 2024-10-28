const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL = [
  // "/",
  "index.html",
  "css/reset.css",
  "css/base.css",
  "css/style.css",
  "assets/favicon.ico",
  "assets/logo.svg",
  "assets/alertIcon.svg",
  "assets/github-mark.svg",
  "assets/img_looking.webp",
  "js/app.js",
  "js/helpers.js",
  "js/index.js",
];
const APP_SHELL_INMUTABLE = [];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  const cacheInmutable = caches
    .open(INMUTABLE_CACHE)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }

      if (key !== DYNAMIC_CACHE && key.includes("dynamic")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

self.addEventListener("fetch", (e) => {
  const respuesta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then((newRes) => {
        if (newRes.ok) {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(e.request, newRes.clone());

            return newRes.clone();
          });
        } else {
          return newRes;
        }
      });
    }
  });

  e.respondWith(respuesta);
});
