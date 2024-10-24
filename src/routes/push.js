import express from 'express';
import admin from 'firebase-admin';
import serviceAccount from '../firebase-admin.json' assert { type: 'json' };

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const router = express.Router();

// 알림 전송 요청 처리
router.post('/notification', async (req, res) => {
  try {
    const { title, body, imageUrl, token, androidData } = req.body;
    await admin.messaging().send({
      token: token,
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {},
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
      data: androidData,
    });

    res.status(200).json({ message: 'Successfully sent notifications!' });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Something went wrong!' });
  }
});

export default router;
