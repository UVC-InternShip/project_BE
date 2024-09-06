import express from 'express';
import contentRouter from './contents';

const router = express.Router();

router.use('/contents', contentRouter);

router.get('/', (req, res) => {
  res.send('index Page');
});

export default router;
