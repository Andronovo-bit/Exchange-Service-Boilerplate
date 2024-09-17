import { Router } from 'express';
import * as TransactionController from '../../../controller/TransactionController'; // Ensure the casing matches the actual file name

const router = Router();

export default (app: Router): void => {
  app.use('/v1/transaction', router);

  // Transaction routes
  router.post('/deposit', TransactionController.deposit);
  router.post('/withdraw', TransactionController.withdraw);
};
