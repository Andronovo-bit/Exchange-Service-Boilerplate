import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';

export const getUserPortfolio = asyncHandler(async (req: Request, res: Response) => {
  //  Find user portfolio
  res.json({ message: 'User portfolio' });
});

export const getUserBalance = asyncHandler(async (req: Request, res: Response) => {
  // Find user balance
  res.json({ message: 'User balance' });
});

export const updateUserDetails = asyncHandler(async (req: Request, res: Response) => {
  //  Update user details
  res.json({ message: 'User details updated' });
});
