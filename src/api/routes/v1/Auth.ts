import { Router } from 'express';
import container from '../../../config/inversify';
import { AuthController } from '../../../controller/AuthController';
import { validate } from '../../../middleware/Validation';
import { loginSchema, registerSchema } from '../../../utils/validation/schema';

const router = Router();
const userController = container.get<AuthController>(AuthController);

export default (app: Router): void => {
  app.use('/v1/auth', router);

  router.post('/login', validate(loginSchema), userController.login);
  router.post('/register', validate(registerSchema), userController.register);
};
