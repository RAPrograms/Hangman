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

self.addEventListener("fetch", (event) => {
    event.respondWith((async () => {
        const cache = await caches.open(cacheName);

        // Network first
        try {
            const response = await fetch(event.request);
            if (response && response.ok) {
                cache.put(event.request, response.clone());
                return response;
            }
        } catch (err) {
            console.log("Request Failed")
        }

        // Fallback to cache
        const cachedResponse = await cache.match(event.request);
        return cachedResponse || new Response("Offline", { status: 503 });
    })());
});
