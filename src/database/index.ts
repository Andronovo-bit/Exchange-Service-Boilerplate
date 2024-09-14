// src/config/database.ts
import { SequelizeConnection } from '../config/database/sequelizeInstance'; // Import the sequelize instance
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const connectDatabase = async (): Promise<void> => {
  try {
    await SequelizeConnection.getInstance().authenticate();
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

export { SequelizeConnection, connectDatabase };
