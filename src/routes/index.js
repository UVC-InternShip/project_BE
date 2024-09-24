import express from 'express';
import userRouter from './user.js';
import reputationRouter from './reputation.js';
import contentRouter from './contents.js';
import changerRouter from './exchangeProposal.js';
import smsRouter from './sms.js';
import chatRouter from './chat.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/reputation', reputationRouter);
router.use('/contents', contentRouter);
router.use('/offer', changerRouter);
router.use('/sms', smsRouter);
router.use('/chat', chatRouter);

export default router;
