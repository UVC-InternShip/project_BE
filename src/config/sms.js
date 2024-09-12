import dotenv from 'dotenv';

dotenv.config();

export const smsConfig = {
  apiKey: process.env.COOLSMS_API_KEY,
  apiSecret: process.env.COOLSMS_API_SECRET,
  senderNumber: process.env.COOLSMS_SENDER_NUMBER,
};
