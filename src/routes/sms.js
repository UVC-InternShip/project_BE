import express from 'express';
import logger from '../../lib/logger.js';
import userService from '../services/userService.js';
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
    if (result == true) {
      const checkUser = await userService.checkUser(phoneNumber);
      if (checkUser == true) {
        return res.status(200).json('이미 가입된 회원 입니다.');
        // 토큰 발급 및 상품 리스트 return
      } else {
        return res.status(200).json('신규 회원 입니다.');
      }
    }
  } catch (error) {
    logger.error('인증 코드 확인 중 오류 발생:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;