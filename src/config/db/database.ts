// src/config/database.ts
import sequelize from './sequelizeInstance'; // Import the sequelize instance
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

export { sequelize, connectDatabase };
