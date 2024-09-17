import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';

export const deposit = asyncHandler(async (req: Request, res: Response) => {
  // Process deposit
  res.json({ message: 'Deposit successful' });
});

export const withdraw = asyncHandler(async (req: Request, res: Response) => {
  // Process withdrawal
  res.json({ message: 'Withdrawal successful' });
});
