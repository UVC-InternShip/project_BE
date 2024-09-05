import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from '../lib/logger.js';

dotenv.config();

const app = express();
logger.info('app start!');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

export default app;
