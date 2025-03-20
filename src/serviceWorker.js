/* eslint-disable no-restricted-globals */
const CACHE_NAME = "wellbee-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Cached Files
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Update Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Register function to be used in index.js
export function register() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/serviceWorker.js").then(
          (registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          },
          (err) => {
            console.log("Service Worker registration failed:", err);
          }
        );
      });
    }
  }
  
  // Unregister function (if needed)
  export function unregister() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error("Error unregistering service worker:", error);
        });
    }
  }