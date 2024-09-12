import express from 'express';
import logger from '../../lib/logger.js';
import { sendVerificationSMS, verifyCode } from '../services/smsService.js';

const router = express.Router();

router.post('/send-verification', async (req, res) => {
  try {
    console.log(req.body);
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: '휴대폰 번호를 입력해주세요.' });
    }
    await sendVerificationSMS(phoneNumber);
    res.status(200).json({ message: '인증 코드가 전송되었습니다.' });
  } catch (error) {
    logger.error('메세지 전송 중 오류 발생:', error);
    res.status(500).json({ error: '메세지 전송 중 오류가 발생했습니다. ' });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
      return res
        .status(400)
        .json({ error: '휴대폰 번호와 인증 코드가 필요합니다.' });
    }
    const result = await verifyCode(phoneNumber, code);
    if (result.isUser) {
      res.status(200).json({
        message: '기존의 회원 정보로 로그인 되었습니다.',
        user: result.user,
        token: result.token,
        contents: result.contentsList,
      });
    } else {
      res.status(200).json('신규 회원 닉네임 입력해주세요.');
    }
  } catch (error) {
    logger.error('인증 코드 확인 중 오류 발생:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
