import { Router } from 'express';
import { TransactionController } from '../../../controller/TransactionController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';

const router = Router();
const transactionController = container.get<TransactionController>(TransactionController);

export default (app: Router): void => {
  app.use('/v1/transaction', router);

  // Transaction routes
  router.post('/deposit/:userId', transactionController.deposit);
  router.post('/withdraw/:userId', transactionController.withdraw);
};
