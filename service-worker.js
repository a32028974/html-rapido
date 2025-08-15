// service-worker.js
const CACHE = "optica-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./estilos.css",
  "./js/main.js",
  "./js/fechaHoy.js",
  "./js/buscarNombre.js",
  "./js/buscarArmazon.js",
  "./js/calculos.js",
  "./js/guardar.js",
  "./js/api.js",
  "./icon-192.png",
  "./icon-512.png"
];

// Instala y precachea
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activa y limpia caches viejos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: cache-first para archivos estáticos; network-first para API
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Requests a tu Apps Script -> network-first
  const isAppsScript = url.hostname.includes("script.google.com");
  if (isAppsScript) {
    e.respondWith(
      fetch(e.request).catch(() => new Response(
        JSON.stringify({ ok:false, error:"Sin conexión" }),
        { headers: { "Content-Type": "application/json" }, status: 503 }
      ))
    );
    return;
  }

  // Estáticos -> cache-first
  e.respondWith(
    caches.match(e.request).then((resp) =>
      resp ||
      fetch(e.request).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((cache) => cache.put(e.request, copy));
        return r;
      })
    )
  );
});
