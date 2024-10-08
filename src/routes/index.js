import express from 'express';
import userRouter from './user.js';
import reputationRouter from './reputation.js';
import contentRouter from './contents.js';
import changerRouter from './exchangeProposer.js';
import smsRouter from './sms.js';
import chatRouter from './chat.js';
import tokenRouter from './token.js';
import pointRouter from './point.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/reputation', reputationRouter);
router.use('/contents', contentRouter);
router.use('/offer', changerRouter);
router.use('/sms', smsRouter);
router.use('/chat', chatRouter);
router.use('/token', tokenRouter);
router.use('/point', pointRouter);

export default router;
