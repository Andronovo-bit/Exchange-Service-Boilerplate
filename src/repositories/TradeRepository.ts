import { Sequelize } from 'sequelize';
import Portfolio from '../models/portfolio/Portfolio'; // Portfolio model
import Trade, { TradeAttributes, TradeCreationAttributes } from '../models/trade/Trade'; // Trade model
import { GenericRepository } from './generic/GenericRepository';
import { inject, injectable } from 'inversify';

@injectable()
class TradeRepository extends GenericRepository<Trade, TradeAttributes, TradeCreationAttributes> {
  constructor(@inject('SequelizeInstance') private sequelizeInstance: Sequelize) {
    super(Trade); // Trade modelini BaseRepository'ye geçiriyoruz
  }

  // Get all trades by user ID
  public async findByUserId(userId: number): Promise<Trade[]> {
    //get the portfolio id of the user
    const portfolio = await Portfolio.findOne({
      fieldMap: { portfolio_id: 'portfolio_id' },
      where: { user_id: userId },
      attributes: ['portfolio_id'],
    });

    if (!portfolio) {
      return [];
    }
    return await this.model.findAll({ where: { portfolio_id: portfolio.portfolio_id } });
  }

  // Create a new trade
  public async createTrade(data: TradeCreationAttributes): Promise<Trade> {
    return await this.create(data);
  }
}

export default TradeRepository;
