import { Request, Response } from 'express';
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
  public getSharePrice = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const shareId = parseInt(req.params.shareId, 10);
    if (isNaN(shareId)) {
      return error(res, 400, 'INVALID_SHARE_ID', 'Invalid share ID');
    }

    const price = await this.priceService.getSharePrice(shareId);
    return success(res, 200, price);
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
}
