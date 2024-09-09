import express from 'express';

import userRouter from './user.js';
import reputationRouter from './reputation.js';
import contentRouter from './contents.js';

const router = express.Router();

router.get('/api', (req, res) => {
  res.send('index Page');
});

router.use('/api/users', userRouter);
router.use('/api/reputation', reputationRouter);
router.use('/contents', contentRouter);

export default router;
