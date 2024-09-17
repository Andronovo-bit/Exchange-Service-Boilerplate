import { Router } from 'express';
import * as PortfolioController from '../../../controller/PortfolioController'; // Ensure the casing matches the actual file name

const router = Router();

export default (app: Router): void => {
  app.use('/v1/portfolio', router);

  router.get('/', PortfolioController.getPortfolio);
  router.get('/share', PortfolioController.getPortfolioByShare);
};
