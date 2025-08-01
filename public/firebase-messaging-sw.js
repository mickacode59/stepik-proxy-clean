importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCvuLYZSmf7-yemdSEltD2daj4cNxCLTVY",
  authDomain: "myrusse-2826d.firebaseapp.com",
  projectId: "myrusse-2826d",
  storageBucket: "myrusse-2826d.appspot.com",
  messagingSenderId: "208172249628",
  appId: "1:208172249628:web:8aabac96e47c76c807a5d9",
  measurementId: "G-LQ51YSDK4Z"
});

// Ajout du handler pour les notifications push avec son
self.addEventListener('push', function(event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.svg',
      sound: data.sound || '/sounds/message.mp3',
    })
  );
});

// Ajout du handler FCM background
if (typeof firebase !== 'undefined' && firebase.messaging) {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(function(payload) {
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/favicon.svg',
      sound: payload.notification.sound || '/sounds/message.mp3',
    });
  });
}
