const cacheName = 'cache-v1';

const precacheResources = [
    // Other
    '/',
    '/index.html',
    '/manifest.json',
    'offline-worker.js',

    // Assets
    '/logos/logo.svg',
    
    // Stylesheets
    '/noscript.css',
    '/style.css',
    '/assets/main.css',

    // Javascript
    '/assets/main.js'
];

self.addEventListener('install', (event) => {
  console.log('Installing service worker');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker active');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
