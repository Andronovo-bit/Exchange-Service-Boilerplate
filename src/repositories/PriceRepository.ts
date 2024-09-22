import { Sequelize } from 'sequelize';
import SharePrice, { SharePriceAttributes, SharePriceCreationAttributes } from '../models/share/SharePrice';
import { GenericRepository } from './generic/GenericRepository';
import { inject, injectable } from 'inversify';
import Share from '../models/share/Share';

@injectable()
class PriceRepository extends GenericRepository<SharePrice, SharePriceAttributes, SharePriceCreationAttributes> {
  constructor(@inject('SequelizeInstance') private readonly sequelizeInstance: Sequelize) {
    super(SharePrice);
  }

  /**
   * Fetches the latest price for a given share.
   *
   * @param shareId - The ID of the share.
   * @returns The latest SharePrice or null if not found.
   */
  public async findLatestPrice(shareId: number): Promise<SharePrice | null> {
    return this.model.findOne({
      where: { share_id: shareId },
      order: [['recorded_at', 'DESC']],
    });
  }

  public async getSharePriceHistory(shareId: number): Promise<SharePrice[] | null> {
    return this.model.findAll({
      where: { share_id: shareId },
      order: [['recorded_at', 'DESC']],
    });
  }

  /**
   * Fetches all shares.
   *
   * @returns An array of Share instances.
   */
  public async getAllShares(): Promise<Share[]> {
    return Share.findAll();
  }

  /**
   * Fetches a share by its symbol.
   *
   * @param symbol - The symbol of the share.
   * @returns The Share instance.
   * @throws Error if the share is not found.
   */
  public async findShareBySymbol(symbol: string): Promise<Share> {
    const share = await Share.findOne({
      where: { symbol },
    });

    if (!share) {
      throw new Error(`Share with symbol ${symbol} not found`);
    }

    return share;
  }

  /**
   * Fetches a share by its ID.
   *
   * @param id - The ID of the share.
   * @returns The Share instance.
   * @throws Error if the share is not found.
   */
  public async getShareById(id: number): Promise<Share> {
    const share = await Share.findByPk(id);

    if (!share) {
      throw new Error(`Share with ID ${id} not found`);
    }

    return share;
  }
}

export default PriceRepository;