import { injectable, inject } from 'inversify';
import { GenericRepository } from './generic/GenericRepository';
import Portfolio, { PortfolioAttributes, PortfolioCreationAttributes } from '../models/portfolio/Portfolio';
import Share from '../models/share/Share';
import PortfolioHoldings from '../models/portfolio/PortfolioHoldings';
import { Sequelize } from 'sequelize';
import User from '../models/user/User';

@injectable()
class PortfolioRepository extends GenericRepository<Portfolio, PortfolioAttributes, PortfolioCreationAttributes> {
  constructor(@inject('SequelizeInstance') private sequelizeInstance: Sequelize) {
    super(Portfolio);
  }

  /**
   * Get the portfolio of a user by user ID.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the portfolio of the user.
   */
  public async findPortfolioByUserId(userId: number): Promise<Portfolio | null> {
    return Portfolio.findOne({
      where: { user_id: userId },
    });
  }

  /**
   * Get the portfolio holdings of a user by user ID.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of portfolio holdings.
   */
  public async findPortfolioHoldingsByUserId(userId: number): Promise<PortfolioHoldings[]> {
    const portfolio = await this.findPortfolioByUserId(userId);

    if (!portfolio) {
      return [];
    }

    return PortfolioHoldings.findAll({
      where: { portfolio_id: portfolio.portfolio_id },
      attributes: ['portfolio_id', 'share_id', 'total_value', 'quantity', 'average_price'],
      include: [
        {
          model: Share,
          attributes: ['symbol', 'name', 'latest_price'],
        },
        {
          model: Portfolio,
          attributes: ['user_id'],
          include: [
            {
              model: User,
              attributes: ['username', 'email'],
            },
          ],
        },
      ],
    });
  }

  /**
   * Get the portfolio holding by user ID and share ID.
   * @param userId - The ID of the user.
   * @param shareId - The ID of the share.
   * @returns A promise that resolves to the portfolio holding or null if not found.
   */
  public async findPortfolioHoldingsByUserAndShareId(userId: number, shareId: number): Promise<PortfolioHoldings | null> {
    const portfolio = await this.findPortfolioByUserId(userId);

    if (!portfolio) {
      return null;
    }

    return PortfolioHoldings.findOne({
      where: { portfolio_id: portfolio.portfolio_id, share_id: shareId },
      include: Share,
    });
  }

  /**
   * Get the portfolio holding by portfolio ID and share ID.
   * @param portfolioId - The ID of the portfolio.
   * @param shareId - The ID of the share.
   * @returns A promise that resolves to the portfolio holding or null if not found.
   */
  public async findPortfolioHoldingsByPortfolioAndShareId(portfolioId: number, shareId: number): Promise<PortfolioHoldings | null> {
    return PortfolioHoldings.findOne({
      where: { portfolio_id: portfolioId, share_id: shareId },
    });
  }
}

export default PortfolioRepository;