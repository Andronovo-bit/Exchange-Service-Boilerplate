import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/AsyncHandler';
import PriceService from '../services/PriceService';
import { inject, injectable } from 'inversify';
import { success, error } from '../middleware/ResponseHandler';

@injectable()
export class PriceController {
  constructor(@inject(PriceService) private priceService: PriceService) {}

  /**
   * Get the price of a specific share.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the share price.
   * @example GET /v1/price/1
   */
  public getSharePriceHistory = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const shareId = parseInt(req.params.shareId, 10);
    if (isNaN(shareId)) {
      return error(res, 400, 'INVALID_SHARE_ID', 'Invalid share ID');
    }

    const prices = await this.priceService.getSharePriceHistory(shareId);
    return success(res, 200, prices);
  });

  /**
   * Update the price of a specific share.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the updated share price.
   * @example PUT /v1/price/1
   */
  public updateSharePrice = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const shareId = parseInt(req.params.shareId, 10);
    if (isNaN(shareId)) {
      return error(res, 400, 'INVALID_SHARE_ID', 'Invalid share ID');
    }

    const { newPrice } = req.body;
    if (typeof newPrice !== 'number' || newPrice <= 0) {
      return error(res, 400, 'INVALID_PRICE', 'New price must be a positive number');
    }

    const updatedPrice = await this.priceService.updateSharePrice(shareId, newPrice);
    return success(res, 200, updatedPrice);
  });

  /**
   * Get all shares.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to an array of share prices.
   * @example GET /v1/price
   */

  public getShares = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const shares = await this.priceService.getShares();
    return success(res, 200, shares);
  });


  /**
   * Get the price of a specific share.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the share price.
   * @example GET /v1/price/share?shareId=1
   * @example GET /v1/price/share/1?shareSymbol=ABC
   */
  public getShare = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const shareId = parseInt(req.query.shareId as string, 10);
    const shareSymbol = req.query.shareSymbol as string;

    if (isNaN(shareId) && !shareSymbol) {
      return error(res, 400, 'INVALID_QUERY', 'Either share ID or share symbol must be provided');
    }

    const price = await this.priceService.getShare(shareId, shareSymbol);
    return success(res, 200, price);
  });
}
