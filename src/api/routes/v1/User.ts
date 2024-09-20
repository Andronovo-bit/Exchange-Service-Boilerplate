import { Router } from 'express';
import { UserController } from '../../../controller/UserController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';
import { validate } from '../../../middleware/Validation';
import { updateUserDetailsSchema } from '../../../utils/validation/schema';
import { authenticateJWT } from '../../../middleware/AuthenticateJWT';

const router = Router();
const userController = container.get<UserController>(UserController);

export default (app: Router): void => {
  app.use('/v1/user', authenticateJWT, router);

  router.get('/portfolio/:userId', userController.getUserPortfolio);
  router.get('/balance/:userId', userController.getUserBalance);
  router.put('/:userId', validate(updateUserDetailsSchema), userController.updateUserDetails);

};
