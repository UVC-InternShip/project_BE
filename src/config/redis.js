import Redis from 'ioredis';
import dotenv from 'dotenv';
import logger from '../../lib/logger.js';

dotenv.config();

const redisOptions = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

const redis = new Redis(redisOptions);

redis.on('error', (error) => {
  logger.error('Redis connection error', error);
});

redis.on('connect', () => {
  logger.info('Successfully connected to Redis');
});

export default redis;
