import { Router } from 'express';
import { TransactionController } from '../../../controller/TransactionController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';
import { validate } from '../../../middleware/Validation';
import { transactionSchema } from '../../../utils/validation/schema';
import { authenticateJWT } from '../../../middleware/AuthenticateJWT';

const router = Router();
const transactionController = container.get<TransactionController>(TransactionController);

export default (app: Router): void => {
  app.use('/v1/transaction', authenticateJWT, router);

  router.post('/deposit/:userId', validate(transactionSchema), transactionController.deposit);
  router.post('/withdraw/:userId', validate(transactionSchema), transactionController.withdraw);
};