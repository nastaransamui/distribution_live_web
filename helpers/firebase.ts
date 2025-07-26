import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import { getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID}`,
  appId: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`,
  measurementId: `${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const messagingPromise = isSupported().then((supported) =>
  supported ? getMessaging(app) : null
);
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Please give notification permission for better result.");
      return null;
    }

    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const swRegistration = await navigator.serviceWorker.ready;
    const messaging = await messagingPromise;
    if (!messaging || !swRegistration) return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: swRegistration,
    });

    return token || null;
  } catch (error) {
    console.error("FCM setup failed:", error);
    return null;
  }
};
