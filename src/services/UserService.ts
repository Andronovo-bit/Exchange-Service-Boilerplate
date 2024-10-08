// src/services/UserService.ts

import { BaseService } from './BaseService';
import UserRepository from '../repositories/UserRepository';
import User, { UserAttributes, UserCreationAttributes } from '../models/user/User';
import { inject, injectable } from 'inversify';
import PortfolioRepository from '../repositories/PortfolioRepository';
import { NotFoundError } from '../utils/errors';
import Portfolio from '../models/portfolio/Portfolio';

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
  public async getUserPortfolio(userId: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findPortfolioByUserId(userId);

    if (!portfolio) {
      throw new NotFoundError('No portfolio found for this user.');
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
      throw new NotFoundError('User not found.');
    }
    return { balance: user.balance };
  }

  /**
   * Get a user by email.
   * @param email - The email of the user.
   * @returns A promise that resolves to the user.
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

}

export default UserService;