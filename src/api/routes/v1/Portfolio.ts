import { Router } from 'express';
import { PortfolioController } from '../../../controller/PortfolioController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';

const router = Router();
const portfolioController = container.get<PortfolioController>(PortfolioController);

export default (app: Router): void => {
  app.use('/v1/portfolio', router);

  router.post('/create/:userId', portfolioController.createPortfolio);
  router.get('/holdings/:userId', portfolioController.getPortfolioHoldings);
  router.get('/holdings/share', portfolioController.getPortfolioHoldingsByShare);
};
