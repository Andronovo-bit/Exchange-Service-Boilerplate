import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';

export const getSharePrice = asyncHandler(async (req: Request, res: Response) => {
  // View share price
  res.json({ message: 'Share price' });
});

export const updateSharePrice = asyncHandler(async (req: Request, res: Response) => {
  // Update share price
  res.json({ message: 'Share price updated' });
});
