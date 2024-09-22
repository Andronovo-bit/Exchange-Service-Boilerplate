import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';
import TradeService from '../services/TradeService';
import { inject, injectable } from 'inversify';
import { success, error } from '../middleware/ResponseHandler';
import type { TradeCreationRequest } from '../models/trade/Trade';
import { tradeGetTypeSchema } from '../utils/validation/schema';

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

    const data: TradeCreationRequest = req.body;
    if (!data.share_id || typeof data.quantity !== 'number' || data.quantity <= 0) {
      return error(res, 400, 'INVALID_INPUT', 'Invalid input parameters');
    }

    const trade = await this.tradeService.buyMarket(userId, data);
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

    const data: TradeCreationRequest = req.body;
    if (!data.share_id || typeof data.quantity !== 'number' || data.quantity <= 0) {
      return error(res, 400, 'INVALID_INPUT', 'Invalid input parameters');
    }

    const trade = await this.tradeService.sellMarket(userId, data);
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

  /**
   * Get market trades with pagination.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the paginated list of trades.
   * @description Get market trades with pagination. The tamplete is /v1/trade/market/history/:userId?page=1&limit=10&tradeType=BUY
   * @example GET /v1/trade/market/history/6?page=1&limit=10
   * @example GET /v1/trade/market/history/6?page=1&limit=10&tradeType=BUY
   * @example GET /v1/trade/market/history/6?page=1&limit=10&tradeType=SELL
   */
  public getMarketTrades = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return error(res, 400, 'INVALID_USER_ID', 'Invalid user ID');
    }

    const { error: validationError } = tradeGetTypeSchema.validate(req.query);

    if (validationError) {
      return error(res, 400, 'INVALID_QUERY_PARAMS', validationError.details[0].message);
    }

    const tradeType = req.query.tradeType as string;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return error(res, 400, 'INVALID_PAGINATION', 'Invalid pagination parameters');
    }
    const trades = await this.tradeService.getMarketTrades(userId, page, limit, tradeType);
    return success(res, 200, trades);
  });
}
