import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import logger from '../../lib/logger.js';

dotenv.config();

let db;

const connectToMongoDB = async () => {
  try {
    const url = process.env.MONGO_CONNECT;
    const client = new MongoClient(url);
    await client.connect();
    db = client.db('chat');
    logger.info('MongoDB Connect Success');
    return db;
  } catch (error) {
    logger.error('MongoDB Connect Fail!', error);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('MongoDB not initialized. Call connectToMongoDB first.');
  }
  return db;
};

export { connectToMongoDB, getDb };
