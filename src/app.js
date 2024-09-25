import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from '../lib/logger.js';
import db from './models/index.js';
import indexRouter from './routes/index.js';
import { createServer } from 'http';
import { initializedSocketIO } from './socket/index.js';
import redis from './config/redis.js';

const app = express();
dotenv.config();

const server = createServer(app);

app.use(
  cors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await redis.ping();
    logger.info('Redis Connect Success');

    await db.sequelize.authenticate();
    logger.info('DB Connect Success');

    await db.sequelize.sync({ force: false, alter: true });
    logger.info('DB Sync Success');

    await db.initializeMongoDB();
    logger.info('MongoDB Initialize Success');

    server.listen(process.env.PORT || 3000, () => {
      console.log(`http://localhost:${process.env.PORT || 3000}/api`);
    });

    app.use('/api', indexRouter);
    initializedSocketIO(server);
  } catch (error) {
    logger.error('Server Start Fail', error);
    process.exit(1);
  }
};

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

startServer();

export default app;
