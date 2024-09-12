import express from 'express';
import contentRouter from './contents.js';
import userRouter from './user.js';
import reputationRouter from './reputation.js';
import smsRouter from './sms.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/reputation', reputationRouter);
router.use('/contents', contentRouter);
router.use('/sms', smsRouter);

export default router;
