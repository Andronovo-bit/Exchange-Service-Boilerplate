import { Router } from 'express';
import { UserController } from '../../../controller/UserController'; // Ensure the casing matches the actual file name
import container from '../../../config/inversify';

const router = Router();
const userController = container.get<UserController>(UserController);

export default (app: Router): void => {
  app.use('/v1/user', router);

  router.get('/portfolio/:userId', userController.getUserPortfolio);
  router.get('/balance/:userId', userController.getUserBalance);
  router.put('/:userId', userController.updateUserDetails);
};
