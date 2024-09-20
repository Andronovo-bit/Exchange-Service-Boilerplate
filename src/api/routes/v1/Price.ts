import { Router } from 'express';
import { PriceController } from '../../../controller/PriceController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';
import { validate } from '../../../middleware/Validation';
import { updateSharePriceSchema } from '../../../utils/validation/schema';
import { authenticateJWTNoUser } from '../../../middleware/AuthenticateJWT';

const router = Router();
const priceController = container.get<PriceController>(PriceController);

export default (app: Router): void => {
  app.use('/v1/price', authenticateJWTNoUser, router);

  router.get('/:shareId', priceController.getSharePrice);
  router.put('/:shareId', validate(updateSharePriceSchema), priceController.updateSharePrice);
};
