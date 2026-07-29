/* Mientras seguimos haciendo cambios seguido, este service worker
   no guarda NINGUNA copia en caché: todo se pide siempre directo a
   internet. Solo existe para que el navegador permita "Instalar
   app". Así evitamos que alguna computadora se quede viendo una
   versión vieja. Más adelante, cuando la app esté más estable,
   se le puede volver a agregar caché para que funcione sin
   internet. */
var CACHE_NAME = "rh-roansa-v3-sin-cache";

self.addEventListener("install", function(event){
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  /* No interceptamos nada: el navegador pide todo normal a internet. */
});
