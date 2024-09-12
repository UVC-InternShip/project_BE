import express from 'express';
import userRouter from './user.js';
import reputationRouter from './reputation.js';
import contentRouter from './contents.js';
import changerRouter from './exchangeProposal.js';
import smsRouter from './sms.js';


const router = express.Router();

router.use('/users', userRouter);
router.use('/reputation', reputationRouter);
router.use('/contents', contentRouter);
router.use('/offer', changerRouter);
router.use('/sms', smsRouter);

export default router;
