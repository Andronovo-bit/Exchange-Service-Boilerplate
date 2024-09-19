import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';
import PortfolioService from '../services/PortfolioService';
import { inject, injectable } from 'inversify';
import { success, error } from '../middleware/ResponseHandler';

@injectable()
export class PortfolioController {
  constructor(@inject(PortfolioService) private portfolioService: PortfolioService) {}

  /**
   * Get the portfolio of a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the portfolio of the user.
   * @example GET /v1/portfolio/holdings/1
   */
  public getPortfolioHoldings = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const portfolio = await this.portfolioService.getUserPortfolioHoldings(userId);
    return success(res, 200, portfolio);
  });

   /**
   * Get a specific share in the portfolio of a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the specific share in the portfolio.
   * @example GET /v1/portfolio/holdings/share?userId=1&shareId=1
   */
  public getPortfolioHoldingsByShare = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.query.userId as string, 10);
    const shareId = parseInt(req.query.shareId as string, 10);
    if (isNaN(userId) || isNaN(shareId)) {
      return error(res, 400, 'INVALID_INPUT', 'Invalid user ID or share ID');
    }
  
    const portfolio = await this.portfolioService.getPortfolioHoldingsByShareId(userId, shareId);
    return success(res, 200, portfolio);
  });

  /**
   * Create a portfolio for a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the created portfolio.
   * @example POST /v1/portfolio/create/1
   */
  public createPortfolio = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const portfolio = await this.portfolioService.createPortfolio(userId);
    return success(res, 201, portfolio);
  });
}
