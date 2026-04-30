// sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBgU3qGYvWd8N7BVgyhS594TjIi1LcD-eQ",
  authDomain: "cucek-up-to-date.firebaseapp.com",
  projectId: "cucek-up-to-date",
  storageBucket: "cucek-up-to-date.firebasestorage.app",
  messagingSenderId: "983707006270",
  appId: "1:983707006270:web:2b5275523ab7c06654e86f",
  measurementId: "G-HZ34LNC0W8"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    icon: '/icon/logo.png',
    badge: '/icon/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'ksu-cucek-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon/icon-192x192.png',
  '/icon/icon-512x512.png'
];

// Install the service worker and cache the app's shell files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Use Network-First strategy to ensure we always get the latest JS chunks from Vercel
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network fetch succeeds, cache it and return
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If network fails (offline), fallback to cache
        return caches.match(event.request);
      })
  );
});

// Clear old caches when a new service worker activates
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
// Handle notification click to open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      // If no window is open, open a new one
      return clients.openWindow('/');
    })
  );
});