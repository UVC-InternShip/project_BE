import express from 'express';
<<<<<<< Updated upstream
import contentRouter from './contents';
import userRouter from './user.js';
import reputationRouter from './reputation.js';
=======
import contentRouter from './contents.js';
>>>>>>> Stashed changes

const router = express.Router();

router.get('/api', (req, res) => {

  res.send('index Page');
});

router.use('/api/users', userRouter);
router.use('/api/reputation', reputationRouter);
router.use('/contents', contentRouter);

export default router;
