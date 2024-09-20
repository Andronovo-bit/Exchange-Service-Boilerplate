import { Router } from 'express';
import { OrderController } from '../../../controller/OrderController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';
import { validate } from '../../../middleware/Validation';
import { cancelLimitOrderSchema, orderLimitSchema } from '../../../utils/validation/schema';
import { authenticateJWT } from '../../../middleware/AuthenticateJWT';

const router = Router();
const orderController = container.get<OrderController>(OrderController);

export default (app: Router): void => {
  app.use('/v1/order', authenticateJWT, router);

  // Transaction routes
  router.post('/create/:userId', validate(orderLimitSchema), orderController.createOrder);
  router.put('/cancel/:userId/:orderId', validate(cancelLimitOrderSchema), orderController.cancelOrder);
  router.get('/pending/:userId', orderController.getPendingOrders);

};
