import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Ensure all required environment variables are set
const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT,
  DB_SSL,
  DB_LOGGING,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST || !DB_PORT) {
  throw new Error('Missing required environment variables for database connection');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: 'postgres', // Change this to your database provider if different - e.g. 'mysql', 'sqlite', etc.
  logging: DB_LOGGING === 'true', // Use environment variable to control logging
  dialectOptions: {
    ssl: DB_SSL === 'true', // Use environment variable to control SSL
  },
});

const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database.');
    await sequelize.sync();
    console.log('Models synchronized.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

export { sequelize, connectDatabase };