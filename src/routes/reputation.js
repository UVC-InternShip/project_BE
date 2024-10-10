import logger from '../../lib/logger.js';
import reputationService from '../services/reputationService.js';
import express from 'express';

const router = express.Router();

router.post('/like', async (req, res) => {
  try {
    const params = {
      userId: req.body.userId,
    };
    const updateUserReputation = await reputationService.processLike(params);
    console.log(updateUserReputation.reputationScore);
    res.status(200).json('success');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/dislike', async (req, res) => {
  try {
    const params = {
      userId: req.body.userId,
    };
    const updateUserReputation = await reputationService.processDisLike(params);
    console.log(updateUserReputation.reputationScore);
    res.status(200).json('success');
  } catch (error) {
    res.status(500).json(error);
  }
});

// 별점(score)에 따른 user 평점 변화
router.put('/update', async (req, res) => {
  try {
    const params = {
      userId: req.body.userId,
      score: req.body.score,
    };
    let reputation = 0;
    if (params.score == 1) {
      reputation = 2;
    } else if (params.score == 2) {
      reputation = 4;
    } else if (params.score == 3) {
      reputation = 6;
    } else if (params.score == 4) {
      reputation = 8;
    } else {
      reputation = 10;
    }

    const newParams = {
      userId: req.body.userId,
      reputationScore: reputation,
    };
    await reputationService.updateReputation(newParams);
    res.status(200).json('success');
  } catch (error) {
    logger.error('update User Reputation error:', error);
    throw error;
  }
});

export default router;
