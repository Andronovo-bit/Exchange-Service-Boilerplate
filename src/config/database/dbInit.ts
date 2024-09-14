import { Model, ModelStatic } from 'sequelize';
import syncOrderedModels from '../../models';
import {SequelizeConnection} from './sequelizeInstance';

// Define a type for the models
type SequelizeModels = { [key: string]: ModelStatic<Model> };

const sequelizeConnection = SequelizeConnection.getInstance();

// Function to initialize the database
const dbInit = async (): Promise<void> => {
  console.log('Initializing the database...');

  const dbModels: SequelizeModels = {};
  syncOrderedModels.forEach((model) => {
    dbModels[model.name] = model;
  });

  try {
    // Initialize all models
    for (const modelName in dbModels) {
      const model = dbModels[modelName];
      await model.sync({ force: true });
    }

    await sequelizeConnection.sync({ force: true }); // Synchronize all models at once
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    throw error;
  }
};

export default dbInit;
