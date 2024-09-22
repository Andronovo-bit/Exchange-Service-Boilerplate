import { Router } from 'express';
import { TradeController } from '../../../controller/TradeController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';
import { tradeMarketSchema } from '../../../utils/validation/schema';
import { validate } from '../../../middleware/Validation';
import { authenticateJWT } from '../../../middleware/AuthenticateJWT';

const router = Router();
const tradeController = container.get<TradeController>(TradeController);

export default (app: Router): void => {
  app.use('/v1/trade', authenticateJWT, router);

  router.post('/market/buy/:userId', validate(tradeMarketSchema), tradeController.buyMarket);
  router.post('/market/sell/:userId',validate(tradeMarketSchema), tradeController.sellMarket);
  router.get('/market/history/:userId', tradeController.getMarketTrades);
};
