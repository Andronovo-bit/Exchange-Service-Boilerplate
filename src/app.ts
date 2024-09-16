// src/app.ts
import express from 'express';
import config from './config/config';
import { connectDatabase } from './config/database/sequelize';
import { initializeModels } from './config/database/initModels';
import loaders from './loaders';

const app = express();

await loaders({ expressApp: app });

// Start Server
const startServer = async () => {
  try {
    await connectDatabase();
    await initializeModels();

    app.listen(config.server.port, () => {
      console.log(`Server is running on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
