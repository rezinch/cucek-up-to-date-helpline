import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
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
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
const db = getFirestore(app);

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
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
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = (callback) => {
  if (!messaging) return;
  return onMessage(messaging, (payload) => {
    console.log("payload", payload);
    if (callback) callback(payload);
  });
};

export { app, messaging, db };
