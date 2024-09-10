import coolsms from 'coolsms-node-sdk';
import redis from '../config/redis.js';
import { generateVerificationCode } from '../utils/codeGenerator.js';
import logger from '../../lib/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const mysms = coolsms.default;
const coolsmsClient = new mysms(
  process.env.COOLSMS_API_KEY,
  process.env.COOLSMS_API_SECRET
);

const CODE_EXPIRY = 300; // 5분

export const sendVerificationSMS = async (phoneNumber) => {
  const verificationCode = generateVerificationCode();

  await redis.set(`sms:${phoneNumber}`, verificationCode, 'EX', CODE_EXPIRY);

  const message = await coolsmsClient.sendOne({
    to: phoneNumber,
    from: process.env.COOLSMS_SENDER_NUMBER,
    text: `바꾸자고 인증번호는 [${verificationCode}] 입니다. 5분 내에 입력해주세요.`,
  });

  logger.info(
    `인증코드 ${verificationCode}가 ${phoneNumber}로 전송되었습니다.`
  );

  return message;
};

export const verifyCode = async (phoneNumber, code) => {
  const storedCode = await redis.get(`sms:${phoneNumber}`);

  if (!storedCode) {
    throw new Error('유효한 인증 코드가 없습니다.');
  }

  if (storedCode !== code) {
    throw new Error('잘못된 인증 코드입니다.');
  }

  await redis.del(`sms:${phoneNumber}`);

  return true;
};
