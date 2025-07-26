// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAe-lc4CMFlhro3dh-W3BSbUEjfsyVuoRA",
  authDomain: "healthcare-b98c3.firebaseapp.com",
  projectId: "healthcare-b98c3",
  storageBucket: "healthcare-b98c3.appspot.com",
  messagingSenderId: "914374052821",
  appId: "1:914374052821:web:5d8edc354d688cdd0ccb5c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const { title, body, icon } = payload.notification || {};

  self.registration.showNotification(title || "Notification", {
    body: body || "You have a new message.",
    icon: icon || "/logo.webp",
  });
});
