import { inject, injectable } from 'inversify';
import PortfolioRepository from '../repositories/PortfolioRepository';
import UserRepository from '../repositories/UserRepository';
import Portfolio, { PortfolioAttributes, PortfolioCreationAttributes } from '../models/portfolio/Portfolio';
import { BaseService } from './BaseService';
import PortfolioHoldings from '../models/portfolio/PortfolioHoldings';
import { NotFoundError } from '../utils/errors';

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
  public async createPortfolio(userId: number): Promise<Portfolio> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const existingPortfolio = await this.portfolioRepository.findPortfolioByUserId(userId);
    if (existingPortfolio) {
      throw new Error('User already has a portfolio.');
    }

    const data: PortfolioCreationAttributes = { user_id: userId, balance: 0 };
    return super.create(data);
  }

  /**
   * Get the portfolio holdings of a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of portfolio holdings.
   */
  public async getUserPortfolioHoldings(userId: number): Promise<PortfolioHoldings[]> {
    const portfolio = await this.portfolioRepository.findPortfolioHoldingsByUserId(userId);
    if (!portfolio.length) {
      throw new NotFoundError('No portfolio found for this user.');
    }
    return portfolio;
  }

  /**
   * Get portfolio holdings by share ID.
   * @param userId - The ID of the user.
   * @param shareId - The ID of the share.
   * @returns A promise that resolves to the portfolio.
   * @throws Error if the portfolio is not found.
   * @throws Error if the user is not found.
   */
  public async getPortfolioHoldingsByShareId(userId: number, shareId: number): Promise<PortfolioHoldings> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    const portfolio = await this.portfolioRepository.findPortfolioHoldingsByUserAndShareId(userId, shareId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found.');
    }
    return portfolio;
  }
}

export default PortfolioService;
