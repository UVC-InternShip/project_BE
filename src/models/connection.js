import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = {
  username: process.env.DB_ID,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
};

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false,
});

export default sequelize;
