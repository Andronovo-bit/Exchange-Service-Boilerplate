// src/database/sequelize.ts
import { SequelizeConnection } from './sequelizeInstance';


const sequelize = SequelizeConnection.getInstance();

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
