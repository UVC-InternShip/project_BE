import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};

export function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error('Invalid token', error);
  }
}

export function verifyAndRefreshTokens(accessToken, refreshToken) {
  try {
    //Access Token이 유효한 경우
    const decoded = jwt.verify(accessToken, jwtConfig.secret);
    console.log('🚀 ~ verifyAndRefreshTokens ~ decoded:', decoded);
    return { accessToken, refreshToken, decoded };
  } catch (error) {
    console.log('🚀 ~ verifyAndRefreshTokens ~ error:', error);
    if (error.name === 'TokenExpiredError') {
      // Access Token이 만료된 경우, Refresh Token을 사용하여 새로운 Access Token 발급
      try {
        const refreshDecoded = jwt.verify(refreshToken, jwtConfig.secret);
        const newAccessToken = generateToken({ id: refreshDecoded.id });
        return {
          accessToken: newAccessToken,
          refreshToken,
          decoded: refreshDecoded,
        };
      } catch (refreshError) {
        throw new Error('Refresh token expired');
      }
    }
    throw error;
  }
}

export default jwtConfig;
