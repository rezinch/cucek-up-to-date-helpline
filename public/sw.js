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
    icon: '/icon/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'ksu-cucek-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/helpdesk.js',
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

// Serve cached content when offline, and fetch from network otherwise
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the file is in the cache, return it
        if (response) {
          return response;
        }
        // Otherwise, fetch it from the network
        return fetch(event.request);
      })
  );
});