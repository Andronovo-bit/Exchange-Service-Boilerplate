import { Router } from 'express';
import * as PriceController from '../../../controller/PriceController'; // Ensure the casing matches the actual file name

const router = Router();

export default (app: Router): void => {
  app.use('/v1/price', router);

  router.get('/price/:shareId', PriceController.getSharePrice);
  router.post('/price/update', PriceController.updateSharePrice);
};
