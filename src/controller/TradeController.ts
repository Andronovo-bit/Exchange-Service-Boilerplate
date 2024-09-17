import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';
import TradeService from '../services/TradeService';
import { inject, injectable } from 'inversify';
import { success, error } from '../middleware/ResponseHandler';

@injectable()
export class TradeController {
  constructor(@inject(TradeService) private tradeService: TradeService) {}

  /**
   * Handle market buy transactions.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the trade details.
   * @example POST /v1/trade/market/buy/1
   */
  public buyMarket = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const { shareId, quantity } = req.body;
    if (!shareId || typeof quantity !== 'number' || quantity <= 0) {
      return error(res, 400, 'INVALID_INPUT', 'Invalid input parameters');
    }

    const trade = await this.tradeService.buyMarket(userId, shareId, quantity);
    return success(res, 200, trade);
  });

  /**
   * Handle market sell transactions.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the trade details.
   * @example POST /v1/trade/market/sell/1
   */
  public sellMarket = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const { shareId, quantity } = req.body;
    if (!shareId || typeof quantity !== 'number' || quantity <= 0) {
      return error(res, 400, 'INVALID_INPUT', 'Invalid input parameters');
    }

    const trade = await this.tradeService.sellMarket(userId, shareId, quantity);
    return success(res, 200, trade);
  });

  /**
   * Handle limit buy transactions.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the trade details.
   * @example POST /v1/trade/limit/buy/1
   */
  public buyLimit = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const { shareId, price, quantity } = req.body;
    if (!shareId || typeof price !== 'number' || typeof quantity !== 'number' || price <= 0 || quantity <= 0) {
      return error(res, 400, 'INVALID_INPUT', 'Invalid input parameters');
    }

    const trade = await this.tradeService.buyLimit(userId, shareId, price, quantity);
    return success(res, 200, trade);
  });

  /**
   * Handle limit sell transactions.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the trade details.
   * @example POST /v1/trade/limit/sell/1
   */
  public sellLimit = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const { shareId, price, quantity } = req.body;
    if (!shareId || typeof price !== 'number' || typeof quantity !== 'number' || price <= 0 || quantity <= 0) {
      return error(res, 400, 'INVALID_INPUT', 'Invalid input parameters');
    }

    const trade = await this.tradeService.sellLimit(userId, shareId, price, quantity);
    return success(res, 200, trade);
  });
}
