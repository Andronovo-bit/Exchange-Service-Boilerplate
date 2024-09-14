// src/config/sequelizeInstance.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_SSL, DB_LOGGING } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST || !DB_PORT) {
  throw new Error('Missing required environment variables for database connection');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: 'postgres',
  logging: DB_LOGGING === 'true',
  dialectOptions: {
    ssl: DB_SSL === 'true',
  },
});

export default sequelize;
