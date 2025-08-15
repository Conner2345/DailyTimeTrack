// Service Worker for Time Bank App - Compatible with Samsung Internet, Chrome, Edge
const CACHE_NAME = 'time-bank-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

// Browser compatibility check
const isSupported = () => {
  return (
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'indexedDB' in window
  );
};

// Install event - cache resources with error handling for all browsers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Try to cache each URL individually for better Samsung Internet compatibility
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn('Failed to cache:', url, err);
              return Promise.resolve();
            });
          })
        );
      })
      .catch(err => {
        console.warn('Cache open failed:', err);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Background sync for timer
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-timer') {
    event.waitUntil(doBackgroundTimer());
  }
});

function doBackgroundTimer() {
  return new Promise((resolve) => {
    // Timer logic will continue to work through localStorage
    // even when app is in background
    resolve();
  });
}

// Handle app installation
self.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  self.deferredPrompt = event;
});