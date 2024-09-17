import { Router } from 'express';
import { TradeController } from '../../../controller/TradeController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';

const router = Router();
const tradeController = container.get<TradeController>(TradeController);

export default (app: Router): void => {
  app.use('/v1/trade', router);

  router.post('/market/buy/:userId', tradeController.buyMarket);
  router.post('/market/sell/:userId', tradeController.sellMarket);
  router.post('/limit/buy/:userId', tradeController.buyLimit);
  router.post('/limit/sell/:userId', tradeController.sellLimit);
};
