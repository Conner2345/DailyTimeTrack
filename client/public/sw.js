// Service Worker for Time Bank App
const CACHE_NAME = 'time-bank-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
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