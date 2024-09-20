import { Router } from 'express';
import { PortfolioController } from '../../../controller/PortfolioController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';
import { validate } from '../../../middleware/Validation';
import { createPortfolioSchema } from '../../../utils/validation/schema';
import { authenticateJWT, authenticateJWTNoUser } from '../../../middleware/AuthenticateJWT';

const router = Router();
const portfolioController = container.get<PortfolioController>(PortfolioController);

export default (app: Router): void => {
  app.use('/v1/portfolio', router);

  router.post('/create/:userId', authenticateJWT, validate(createPortfolioSchema), portfolioController.createPortfolio);
  router.get('/holdings/:userId', authenticateJWT, portfolioController.getPortfolioHoldings);
  router.get('/holdings/share', authenticateJWTNoUser, portfolioController.getPortfolioHoldingsByShare);
};
