import express from 'express';
import mapService from '../services/mapService.js';
import logger from '../../lib/logger.js';

const router = express.Router();

router.post('/get-address', async (req, res) => {
  try {
    const params = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };
    const result = await mapService.getLocation(params);
    res.status(200).json(result);
  } catch (error) {
    logger.error('get Address error:', error);
    throw error;
  }
});

export default router;
