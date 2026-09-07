// Service worker — app instalável e disponível offline.
// Estratégia: network-first para a página (pega atualizações quando há internet,
// cai pro cache offline); cache-first para ícones/manifest (mudam pouco).
const CACHE = "festa1ano-v3";
const ASSETS = ["./", "./index.html", "./confirmar.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isDoc = req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");

  if (isDoc) {
    // network-first: tenta a versão nova; se offline, usa o cache
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match(
          url.pathname.endsWith("confirmar.html") ? "./confirmar.html" : "./index.html")))
    );
  } else {
    // cache-first para assets estáticos
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit))
    );
  }
});
