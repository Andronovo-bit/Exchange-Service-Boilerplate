// src/app.ts
import express, { NextFunction, Request, Response } from 'express';
import config from './config/config';
import { connectDatabase } from './config/database/sequelize';
import { initializeModels } from './config/database/initModels';
import morgan from 'morgan';
import Trade from './models/trade/Trade';

const app = express();

// Middleware
app.use(express.json());
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//test trade add api
app.get('/trade', async (req, res) => {
  try {
    const trade = await Trade.create({
      portfolio_id: 1,
      share_id: 1,
      trade_type: 'BUY',
      quantity: 10,
      price: 700.0,
      trade_date: new Date(),
    });
    res.json(trade);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

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
