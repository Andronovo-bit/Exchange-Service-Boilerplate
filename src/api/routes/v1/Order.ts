import { Router } from 'express';
import { OrderController } from '../../../controller/OrderController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';

const router = Router();
const orderController = container.get<OrderController>(OrderController);

export default (app: Router): void => {
  app.use('/v1/order', router);

  // Transaction routes
  router.post('/create/:userId', orderController.createOrder);
  router.put('/cancel/:orderId', orderController.cancelOrder);
  router.get('/pending/:userId', orderController.getPendingOrders);
  router.put('/complete/partial/:orderId', orderController.processPartialOrder);
  router.put('/complete/:orderId', orderController.completeOrder);
};
