import { Op, Sequelize } from 'sequelize';
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
  /**
   * Get market trades with pagination.
   *
   * @param portfolioId - The ID of the portfolio.
   * @param page - The page number.
   * @param limit - The number of trades per page.
   * @param tradeType - The type of trade (optional).
   * @returns A promise that resolves to the paginated list of trades.
   */
  public async getMarketTrades(
    portfolioId: number,
    page: number,
    limit: number,
    tradeType?: string,
  ): Promise<{ trades: Trade[]; total: number }> {
    const offset = (page - 1) * limit;

    const whereCondition = {
      trade_type: tradeType ? { [Op.eq]: tradeType } : { [Op.in]: ['SELL', 'BUY'] },
      portfolio_id: portfolioId,
    };

    const { rows: trades, count: total } = await Trade.findAndCountAll({
      where: whereCondition,
      order: [['trade_date', 'DESC']],
      limit,
      offset,
    });

    return { trades, total };
  }
}

export default TradeRepository;
