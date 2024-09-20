import { Router } from 'express';
import v1UserRoutes from './routes/v1/User';
import v1OrderRoutes from './routes/v1/Order';
import v1PriceRoutes from './routes/v1/Price';
import v1PortfolioRoutes from './routes/v1/Portfolio';
import v1TransactionRoutes from './routes/v1/Transaction';
import v1TradeRoutes from './routes/v1/Trade';
import v1AuthRoutes from './routes/v1/Auth';

const registerRoutes = (app: Router): void => {
  v1AuthRoutes(app);
  v1UserRoutes(app);
  v1OrderRoutes(app);
  v1PriceRoutes(app);
  v1PortfolioRoutes(app);
  v1TransactionRoutes(app);
  v1TradeRoutes(app);
  // v1WatchlistRoutes(app); // Uncomment when watchlist routes are ready
};

const createRouter = (): Router => {
  const app = Router();
  registerRoutes(app);
  return app;
};

export default createRouter;