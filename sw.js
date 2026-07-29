var CACHE_NAME = "rh-roansa-v2";
var APP_SHELL = ["./manifest.json"];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(APP_SHELL); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  var url = event.request.url;
  /* Nunca cachear llamadas a Supabase (datos y documentos en tiempo real) ni al CDN */
  if(url.indexOf("supabase.co") !== -1 || url.indexOf("jsdelivr.net") !== -1){
    return;
  }
  /* La página principal (index.html) siempre se pide primero a internet,
     así los cambios y actualizaciones se ven de inmediato en todas las
     computadoras, sin quedarse con una copia vieja guardada. */
  if(event.request.mode === "navigate" || url.indexOf("index.html") !== -1){
    event.respondWith(
      fetch(event.request).catch(function(){ return caches.match(event.request); })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(cached){
      return cached || fetch(event.request);
    })
  );
});
