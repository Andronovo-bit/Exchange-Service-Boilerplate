// src/services/UserService.ts

import { BaseService } from './BaseService';
import UserRepository from '../repositories/UserRepository';
import User, { UserAttributes, UserCreationAttributes } from '../models/user/User';
import { inject, injectable } from 'inversify';
import PortfolioRepository from '../repositories/PortfolioRepository';
import PortfolioHoldings from '../models/portfolio/PortfolioHoldings';

@injectable()
class UserService extends BaseService<User, UserAttributes, UserCreationAttributes> {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(PortfolioRepository) private portfolioRepository: PortfolioRepository,
  ) {
    super(userRepository);
  }

  /**
   * Create a new user with custom logic to check for existing email. Overrides the base create method.
   * @param data - The user creation attributes.
   * @returns A promise that resolves to the created user.
   */
  public async create(data: UserCreationAttributes): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('A user with this email already exists.');
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

  /**
   * Get the current balance of a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an object containing the balance.
   */
  public async getUserBalance(userId: number): Promise<{ balance: number }> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return { balance: user.balance };
  }

}

export default UserService;