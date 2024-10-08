import express from 'express';
import pointService from '../services/pointService.js';

const router = express.Router();

// 주간 포인트 추가 API
router.post('/add', async (req, res) => {
  const params = {
    userId: req.body.userId,
    pointsToAdd: req.body.pointsToAdd,
  };
  console.log('🚀 ~ router.post ~ req.body:', params);
  try {
    const result = await pointService.addPoints(params);
    //res.status(200).send('Points added successfully');
    res.status(200).json({ state: 'success', result });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 주간 포인트 리셋 API
router.post('/reset', async (req, res) => {
  try {
    await pointService.resetWeeklyPoints();
    res.status(200).send('Weekly points reset successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 주간 랭킹 조회 API
router.get('/rankings/weekly', async (req, res) => {
  try {
    const weeklyRankings = await pointService.getWeeklyRankings();
    res.status(200).json(weeklyRankings);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 누적 랭킹 조회 API
router.get('/rankings/total', async (req, res) => {
  try {
    const totalRankings = await pointService.getTotalRankings();
    res.status(200).json(totalRankings);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
