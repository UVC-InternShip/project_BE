import express from 'express';
import contentRouter from './contents.js';
import userRouter from './user.js';
import reputationRouter from './reputation.js';

const router = express.Router();

router.get('/api', (req, res) => {
  res.send('index Page');
});

router.use('/api/users', userRouter);
router.use('/api/reputation', reputationRouter);
router.use('/api/contents', contentRouter);

export default router;
