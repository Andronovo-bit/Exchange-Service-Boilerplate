import { connectDatabase } from '../database';
import { initializeModels } from '../config/database/initModels';

export default async (): Promise<void> => {
  try {
    await connectDatabase();
    await initializeModels();
  } catch (error) {
    console.error('Failed to load Sequelize:', error);
    throw error;
  }
};
