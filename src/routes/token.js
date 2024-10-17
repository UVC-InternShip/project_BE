import express from 'express';
import logger from '../../lib/logger.js';
import dotenv from 'dotenv';
import { verifyAndRefreshTokens } from '../config/jwt.js';

dotenv.config();

const router = express.Router();

router.post('/validate-token', async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  console.log('🚀 ~ router.post ~ req.body:', req.body);

  if (!accessToken || !refreshToken) {
    return res.status(400).json({
      valid: false,
      message: '액세스 토큰과 리프레시 토큰이 필요합니다.',
    });
  }

  try {
    // verifyAndRefreshTokens 함수를 사용하여 토큰 검증 및 갱신
    const result = verifyAndRefreshTokens(accessToken, refreshToken);
    console.log('🚀 ~ router.post ~ result:', result);

    // 토큰이 유효하거나 성공적으로 갱신된 경우
    res.json({
      valid: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: { id: result.decoded.userId }, // 필요한 사용자 정보를 추가할 수 있습니다.
    });

    console.log('🚀 ~ router.post ~ req.body:', result.decoded.userId);
  } catch (error) {
    logger.error('토큰 검증 중 오류 발생:', error);

    if (error.message === 'Refresh token expired') {
      // 리프레시 토큰도 만료된 경우
      return res
        .status(401)
        .json({ valid: false, message: '재로그인이 필요합니다.' });
    }

    // 기타 오류의 경우
    res
      .status(400)
      .json({ valid: false, message: '유효하지 않은 토큰입니다.' });
  }
});

export default router;
