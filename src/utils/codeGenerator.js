import crypto from 'crypto';

export const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};
