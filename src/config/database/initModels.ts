// src/database/initModels.ts
import sequelize from './sequelize';
import syncOrderedModels from '../../models';
import type { Model, ModelStatic } from 'sequelize';
import config from '../config';

type SequelizeModels = { [key: string]: ModelStatic<Model> };

export const initializeModels = async (): Promise<void> => {
  try {
    // In development, sync models with { alter: true } to auto-update tables.

    // const syncOptions = {
    //   force: config.env === 'development',
    //   alter: config.env === 'development',
    //   cascade: true,
    // };

    const syncOptions = {};
    
    // Sync all models with the database
    const dbModels: SequelizeModels = {};
    syncOrderedModels.forEach((model) => {
      dbModels[model.name] = model;
    });

    //Initialize all models
    for (const modelName in dbModels) {
      const model = dbModels[modelName];
      await model.sync(syncOptions);
    }

    await sequelize.sync(syncOptions);
    console.log('Models synchronized successfully.');
  } catch (error) {
    console.error('Model synchronization failed:', error);
    throw error;
  }
};
