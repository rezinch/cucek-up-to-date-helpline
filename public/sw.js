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

// Aggressive background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js v5] Received background message ', payload);
  
  // Extract data from all possible locations in the payload
  const data = payload.data || {};
  const notification = payload.notification || {};
  
  const title = data.title || notification.title || 'CUCEK UP-TO-DATE';
  const body = data.body || data.message || notification.body || 'New update available';

  const notificationOptions = {
    body: body,
    icon: '/icon/logo.png',
    badge: '/icon/icon-192x192.png',
    tag: 'ksu-announcement',
    renotify: true,
    data: {
        url: '/'
    }
  };

  return self.registration.showNotification(title, notificationOptions);
});

const CACHE_NAME = 'ksu-cucek-cache-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon/icon-192x192.png',
  '/icon/icon-512x512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) client = clientList[i];
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});