import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import UserService from '../services/UserService';
import { asyncHandler } from '../middleware/AsyncHandler';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  public getUserPortfolio = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const portfolio = await this.userService.getUserPortfolio(userId);
    res.json(portfolio);
  });

  public getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.findAll(); // BaseService'teki findAll fonksiyonu
    res.json(users);
  });

  public getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const user = await this.userService.findById(userId); // BaseService'teki findById fonksiyonu
    res.json(user);
  });

  public getUserBalance = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const balance = await this.userService.getUserBalance(userId);
    res.json(balance);
  });
}
