import { Router } from 'express';
import * as TradeController from '../../../controller/TradeController'; // Ensure the casing matches the actual file name

const router = Router();

export default (app: Router): void => {
  app.use('/v1/trade', router);

  router.post('/market/buy', TradeController.buyMarket);
  router.post('/market/sell', TradeController.sellMarket);
  router.post('/limit/buy', TradeController.buyLimit);
  router.post('/limit/sell', TradeController.sellLimit);
};
