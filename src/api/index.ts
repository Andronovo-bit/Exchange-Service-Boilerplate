import { Router } from 'express';
// import v1account from "./routes/v1/Account";
import v1user from './routes/v1/User';
import v1order from './routes/v1/Order';
import v1price from './routes/v1/Price';
import v1portfolio from './routes/v1/Portfolio';
import v1transaction from './routes/v1/Transaction';
// import v1watchlist from "./routes/v1/Watchlist";
import v1trade from './routes/v1/Trade';

export default (): Router => {
  const app = Router();

  // v1account(app);

  v1user(app);
  v1order(app);
  v1price(app);
  v1portfolio(app);
  v1transaction(app);
  // v1watchlist(app);
  v1trade(app);

  return app;
};
