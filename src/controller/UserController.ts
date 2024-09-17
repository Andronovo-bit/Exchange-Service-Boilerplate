import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import UserService from '../services/UserService';
import { asyncHandler } from '../middleware/AsyncHandler';
import { success, error } from '../middleware/ResponseHandler';
import { UserAttributes } from '../models/user/User';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  /**
   * Get the portfolio of a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the portfolio of the user.
   */
  public getUserPortfolio = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }
    const portfolio = await this.userService.getUserPortfolio(userId);
    return success(res, 200, portfolio);
  });

  /**
   * Get all users.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to an array of users.
   */
  public getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const users = await this.userService.findAll();
    return success(res, 200, users);
  });

  /**
   * Get a user by ID.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the user.
   */
  public getUserById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }
    const user = await this.userService.findById(userId);
    if (!user) {
      return error(res, 404, 'USER_NOT_FOUND', 'User not found');
    }
    return success(res, 200, user);
  });

  /**
   * Get the balance of a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the balance of the user.
   */
  public getUserBalance = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }
    const balance = await this.userService.getUserBalance(userId);
    return success(res, 200, balance);
  });

  /**
   * Update the details of a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the updated user.
   * @example PUT /v1/user/1
   */
  public updateUserDetails = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }
    const userDetails: Partial<Omit<UserAttributes, 'password' | 'id' | 'balance'>> = req.body;
    const updatedUser = await this.userService.update(userId, userDetails);
    return success(res, 200, updatedUser);
  });
}
