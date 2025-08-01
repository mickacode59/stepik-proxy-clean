// Cloud Function pour relayer Firestore -> FCM
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.firestore.document('pushNotifications/{id}').onCreate(async (snap, context) => {
  const notif = snap.data();
  const userDoc = await admin.firestore().collection('users').doc(notif.to).get();
  const fcmToken = userDoc.data().fcmToken;
  if (!fcmToken) return;
  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title: notif.title,
      body: notif.body,
      sound: notif.sound || 'default',
    },
    android: {
      notification: {
        sound: notif.sound || 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: notif.sound || 'default',
        },
      },
    },
  });
});
