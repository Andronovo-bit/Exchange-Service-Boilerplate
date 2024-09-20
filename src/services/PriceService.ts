import { inject, injectable } from 'inversify';
import PriceRepository from '../repositories/PriceRepository';
import { BaseService } from './BaseService';
import SharePrice, { SharePriceAttributes, SharePriceCreationAttributes } from '../models/share/SharePrice';
import { NotFoundError } from '../utils/errors';
import Share from '../models/share/Share';

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
      throw new NotFoundError('Share price not found');
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

  /**
   * Get all share prices.
   * @returns A promise that resolves to an array of share prices.
   * @throws NotFoundError if no share prices are found.
   * @throws Error if an unexpected error occurs.
   */
  public async getShares(): Promise<Share[]> {
    const sharePrices = await this.priceRepository.getAllShares();

    if (!sharePrices) {
      throw new NotFoundError('Share prices not found');
    }
    return sharePrices;
  }

  public async getShareById(symbol: string): Promise<Share> {
    const share = await this.priceRepository.findShareBySymbol(symbol);

    if (!share) {
      throw new NotFoundError('Share not found');
    }
    return share;
  }
}

export default PriceService;
