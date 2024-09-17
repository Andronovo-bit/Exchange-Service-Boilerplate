import { Router } from 'express';
import * as UserController from '../../../controller/UserController'; // Ensure the casing matches the actual file name

const router = Router();

export default (app: Router): void => {

  app.use('/v1/user', router);

  router.get('/portfolio', UserController.getUserPortfolio);
  router.get('/balance', UserController.getUserBalance);
  
};
