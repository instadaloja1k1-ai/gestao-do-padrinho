const CACHE_NAME = 'gestao-do-padrinho-v1';
const APP_SHELL = ['./index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Só cacheia o "shell" do app (HTML/CSS/JS estáticos).
// Chamadas ao Firebase (auth/firestore) sempre vão direto pra rede.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // deixa passar Firebase/CDN
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
