import { Sequelize } from 'sequelize';
import SharePrice, { SharePriceAttributes, SharePriceCreationAttributes } from '../models/share/SharePrice'; // SharePrice model
import { GenericRepository } from './generic/GenericRepository';
import { inject, injectable } from 'inversify';

@injectable()
class PriceRepository extends GenericRepository<SharePrice, SharePriceAttributes, SharePriceCreationAttributes> {
  constructor(@inject('SequelizeInstance') private sequelizeInstance: Sequelize) {
    super(SharePrice); // SharePrice modelini BaseRepository'ye geçiriyoruz
  }

  // Belirli bir hisse fiyatını getir
  public async findLatestPrice(shareId: number): Promise<SharePrice | null> {
    return await this.model.findOne({
      where: { share_id: shareId },
      order: [['recorded_at', 'DESC']], // En son kaydı getir
    });
  }
}

export default PriceRepository;
