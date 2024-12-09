const CACHE_NAME = 'pwa-cache-v1'; // Cache version
const ASSETS_TO_CACHE = [
  '/',  // Home page
  '/static/images/icon.png',  // Icon
  '/static/images/apple-icon.png',  // Apple icon
  '/static/css/styles.css',  // Styles (if any)
  '/static/js/main.js',  // Your JS (if any)
  '/offline.html'  // Fallback offline page
];

// Install event: Cache the specified assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Caching assets during install');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];  // Keep only the latest cache

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Delete old caches that are not in the whitelist
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached assets or fallback to fetch from the network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // If the request is found in the cache, return it
      if (response) {
        return response;
      }

      // Otherwise, try to fetch the request from the network
      return fetch(event.request).catch(function() {
        // If the network is unavailable, serve the offline page
        return caches.match('/offline.html');
      });
    })
  );
});
