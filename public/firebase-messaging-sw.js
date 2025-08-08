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
  const title = payload.notification?.title || "Notification";
  const body = payload.notification?.body || "You have a new message.";
  const icon = payload.notification?.icon || "/health_logo_clear_70.webp";
  const click_action =
    payload.data?.click_action || "https://health-care.duckdns.org/";

  const notificationOptions = {
    body,
    icon,
    data: {
      click_action,
    },
    actions: [
      { action: "open_chat", title: "Open Chat" },
      { action: "dismiss", title: "Dismiss" },
    ],
    requireInteraction: true,
  };

  self.registration.showNotification(title, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const action = event.action;
  const targetUrl = event.notification.data?.click_action || "/";
  if (action === "dismiss") return;
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
