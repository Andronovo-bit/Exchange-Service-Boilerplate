import { inject, injectable } from 'inversify';
import PortfolioRepository from '../repositories/PortfolioRepository';
import UserRepository from '../repositories/UserRepository';
import Portfolio, { PortfolioAttributes, PortfolioCreationAttributes } from '../models/portfolio/Portfolio';
import { BaseService } from './BaseService';
import PortfolioHoldings from '../models/portfolio/PortfolioHoldings';

@injectable()
class PortfolioService extends BaseService<Portfolio, PortfolioAttributes, PortfolioCreationAttributes> {
  constructor(
    @inject(PortfolioRepository) private portfolioRepository: PortfolioRepository,
    @inject(UserRepository) private userRepository: UserRepository,
  ) {
    super(portfolioRepository);
  }

  /**
   * Create a new portfolio for a user.
   * @param userId - The ID of the user.
   * @param data - The portfolio creation attributes.
   * @returns A promise that resolves to the created portfolio.
   */
  public async createPortfolio(userId: number, data: PortfolioCreationAttributes): Promise<Portfolio> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return super.create(data);
  }

  /**
   * Get the portfolio holdings of a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of portfolio holdings.
   */
  public async getUserPortfolio(userId: number): Promise<PortfolioHoldings[]> {
    const portfolio = await this.portfolioRepository.findByUserId(userId);
    if (!portfolio.length) {
      throw new Error('No portfolio found for this user.');
    }
    return portfolio;
  }

}

export default PortfolioService;