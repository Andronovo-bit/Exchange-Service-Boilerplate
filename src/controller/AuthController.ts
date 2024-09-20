import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import AuthService from '../services/AuthService';
import { asyncHandler } from '../middleware/AsyncHandler';
import { success, error } from '../middleware/ResponseHandler';
import type { UserCreationAttributes } from '../models/user/User';
import { loginSchema, registerSchema } from '../utils/validation/schema';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  public login = asyncHandler(async (req: Request, res: Response) => {
    const { error: validationError } = loginSchema.validate(req.body);
    if (validationError) {
      return error(res, 400, 'VALIDATION_ERROR', validationError.message);
    }

    const { email, password } = req.body;

    try {
      const { token } = await this.authService.login(email, password);
      return success(res, 200, { token }, 'Login successful');
    } catch (err:any) {
      return error(res, 401, 'INVALID_CREDENTIALS', err.message);
    }
  });

  public register = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { error: validationError } = registerSchema.validate(req.body);
    if (validationError) {
      return error(res, 400, 'VALIDATION_ERROR', validationError.message);
    }

    const data: UserCreationAttributes = req.body;
    const user = await this.authService.register(data);
    return success(res, 201, user, 'User created successfully');
  });
}
