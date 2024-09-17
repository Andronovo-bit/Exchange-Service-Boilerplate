import { Router } from 'express';
import { PriceController } from '../../../controller/PriceController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';

const router = Router();
const priceController = container.get<PriceController>(PriceController);

export default (app: Router): void => {
  app.use('/v1/price', router);

  router.get('/:shareId', priceController.getSharePrice);
  router.put('/:shareId', priceController.updateSharePrice);
};
