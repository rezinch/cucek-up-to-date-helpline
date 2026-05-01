import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgU3qGYvWd8N7BVgyhS594TjIi1LcD-eQ",
  authDomain: "cucek-up-to-date.firebaseapp.com",
  projectId: "cucek-up-to-date",
  storageBucket: "cucek-up-to-date.firebasestorage.app",
  messagingSenderId: "983707006270",
  appId: "1:983707006270:web:2b5275523ab7c06654e86f",
  measurementId: "G-HZ34LNC0W8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Safe initialization for Analytics and Messaging
let analytics = null;
let messaging = null;

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Firebase Analytics not supported in this environment.");
  }

  // isSupported() check is essential for Safari/iOS stability
  isSupported().then(supported => {
    if (supported) {
      try {
        messaging = getMessaging(app);
      } catch (e) {
        console.error("Failed to initialize Firebase Messaging:", e);
      }
    }
  }).catch(() => {
    console.log("Messaging is not supported in this browser.");
  });
}

export const requestForToken = async () => {
  // If messaging is not supported or failed to init, return null early
  if (!messaging) return null;
  
  // Only allow notifications for installed PWA users
  const isStandalone = typeof window !== 'undefined' && 
    (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);
  
  if (!isStandalone) {
    console.log('Notifications are restricted to installed app users.');
    return null;
  }

  try {
    // Check if Notification API exists (prevents crash on older Safari)
    if (typeof Notification === 'undefined') {
      console.log('Notification API not supported.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted by user.');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const currentToken = await getToken(messaging, {
      vapidKey: 'BACbHMubYWhh40BmpHwTxhn3gbMrbXYKs5kM8B_WNUe8pA6dDzaFiy2VgJNyx0wNRDeYgS0GEFOH9L8zmIuAdNk',
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      console.log('FCM Token:', currentToken);
      try {
        await setDoc(doc(db, "tokens", currentToken), {
          token: currentToken,
          updatedAt: new Date().toISOString()
        });
      } catch(e) {
        console.error("Failed to save token to database", e);
      }
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = (callback) => {
  // Guard against null messaging
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log("Received foreground message", payload);
    if (callback) callback(payload);
  });
};

export { app, messaging, db };
