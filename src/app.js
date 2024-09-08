import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from '../lib/logger.js';

import db from './models/index.js';
import indexRouter from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .authenticate()
  .then(() => {
    logger.info('DB Connect Success!');
    db.sequelize
      .sync({ alter: true })
      .then(async () => {
        logger.info('DB Sync Success!');
      })
      .catch((err) => {
        logger.error('DB Sync Fail!', err);
      });
  })
  .catch((err) => {
    logger.error('DB Connect Fail!', err);
  });

app.use('/api', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/api`);
});

export default app;
