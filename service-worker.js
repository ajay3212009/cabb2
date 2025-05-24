const CACHE_NAME = 'quickcab-cache-v1';
// Essential files for the app shell.
// In a real build process, these would include hashed JS/CSS bundles.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add paths to critical local assets like a logo if you have one.
  // e.g., '/icons/logo.svg'
  // Note: Images from AVAILABLE_CAB_OPTIONS (picsum.photos) are external and not pre-cached here.
  // CDN resources (esm.sh) are handled by browser cache based on their headers.
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate new service worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache app shell during install:', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle requests for extensions (if any)
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Serve from cache
        }

        // Not in cache, fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Do not cache unsuccessful responses or non-basic types (e.g. opaque responses for cross-origin resources without CORS)
            // Also, avoid caching API calls or dynamic content here unless specifically intended.
            // The GenAI SDK and esm.sh resources are external and should rely on standard browser caching.
            if (!networkResponse || networkResponse.status !== 200 || 
                (networkResponse.type !== 'basic' && networkResponse.type !== 'cors') ||
                event.request.url.includes('/@google/genai') ||
                event.request.url.includes('https://esm.sh/') ||
                event.request.method !== 'GET' // Only cache GET requests
            ) {
              return networkResponse;
            }

            // Clone the response to cache it and serve it.
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          }
        ).catch(() => {
          // Fallback for network failure
          // For navigation requests, you might want to return a specific offline page or the app shell.
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          // For other types of requests (e.g., images, API calls),
          // returning nothing or a specific error response might be appropriate.
          // Here, we simply let the browser handle the error.
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Ensure new SW takes control immediately
  );
});