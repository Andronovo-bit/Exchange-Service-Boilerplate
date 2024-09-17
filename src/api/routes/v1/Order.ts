import { Router } from 'express';
import * as OrderController from '../../../controller/OrderController'; // Ensure the casing matches the actual file name

const router = Router();

export default (app: Router): void => {
  app.use('/v1/order', router);

  // Transaction routes
  router.post('/create', OrderController.createOrder);
  router.post('/cancel', OrderController.cancelOrder);
};
