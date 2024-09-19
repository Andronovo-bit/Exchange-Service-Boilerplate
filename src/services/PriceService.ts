import { inject, injectable } from 'inversify';
import PriceRepository from '../repositories/PriceRepository';
import { BaseService } from './BaseService';
import SharePrice, { SharePriceAttributes, SharePriceCreationAttributes } from '../models/share/SharePrice';

@injectable()
class PriceService extends BaseService<SharePrice, SharePriceAttributes, SharePriceCreationAttributes> {
  constructor(@inject(PriceRepository) private priceRepository: PriceRepository) {
    super(priceRepository);
  }

  /**
   * Get the latest share price.
   * @param shareId - The ID of the share.
   * @returns A promise that resolves to the latest share price.
   */
  public async getSharePrice(shareId: number): Promise<SharePrice> {
    const latestPrice = await this.priceRepository.findLatestPrice(shareId);
    if (!latestPrice) {
      throw new Error('Share price not found');
    }
    return latestPrice;
  }

  /**
   * Update the share price.
   * @param shareId - The ID of the share.
   * @param newPrice - The new price of the share.
   * @returns A promise that resolves to the updated share price.
   */
  public async updateSharePrice(shareId: number, newPrice: number): Promise<SharePrice> {
    const sharePrice: SharePriceCreationAttributes = {
      share_id: shareId,
      price: newPrice,
      recorded_at: new Date(),
    };

    const updatedPrice = await this.priceRepository.create(sharePrice);

    return updatedPrice;
  }
}

export default PriceService;
