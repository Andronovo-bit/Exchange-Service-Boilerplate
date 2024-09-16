// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

// The middleware that provides error handling for async functions
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
