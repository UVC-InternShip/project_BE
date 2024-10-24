import * as admin from 'firebase-admin';
//import serviceAccount from './firebase-admin.json';
import serviceAccount from './firebase-admin.json' assert { type: 'json' };

const connect = async () => {
  let firebase;
  try {
    if (admin.apps.length === 0) {
      firebase = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Connect FCM: Initialize FCM SDK');
    } else {
      firebase = admin.app();
      console.log('Connect FCM');
    }
  } catch (error) {
    console.log('FCM connection error:: ', error.message);
  }
};

export default connect;
