// Minimal service worker — just enough to make the app installable.
// It caches the app shell so it also opens if offline (the AI roadmap
// feature still needs a live connection to the backend, but habits,
// the timer, and badges keep working offline).

var CACHE_NAME = 'anchor-shell-v1';
var SHELL_FILES = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  // Never cache API calls — always go to the network for those.
  if (event.request.url.indexOf('/api/') !== -1) return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
