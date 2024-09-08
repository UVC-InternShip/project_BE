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

export default router;
