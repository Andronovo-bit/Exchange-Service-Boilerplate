import { inject, injectable } from 'inversify';
import TradeRepository from '../repositories/TradeRepository';
import UserRepository from '../repositories/UserRepository';
import PriceRepository from '../repositories/PriceRepository';
import PortfolioRepository from '../repositories/PortfolioRepository';
import { BaseService } from './BaseService';
import Trade, { TradeAttributes, TradeCreationAttributes, TradeCreationRequest } from '../models/trade/Trade';
import { BadRequestError, NotFoundError } from '../utils/errors';

@injectable()
class TradeService extends BaseService<Trade, TradeAttributes, TradeCreationAttributes> {
  constructor(
    @inject(TradeRepository) private tradeRepository: TradeRepository,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(PriceRepository) private priceRepository: PriceRepository,
    @inject(PortfolioRepository) private portfolioRepository: PortfolioRepository,
  ) {
    super(tradeRepository);
  }

  /**
   * Buy shares at market price.
   * @param userId - The ID of the user.
   * @param shareId - The ID of the share.
   * @param quantity - The quantity of shares to buy.
   * @returns A promise that resolves to the created trade.
   */
  public async buyMarket(userId: number, data: TradeCreationRequest): Promise<Trade> {
    const { share_id, quantity } = data;

    const latestPrice = await this.priceRepository.findLatestPrice(share_id);
    if (!latestPrice) throw new BadRequestError('Market price not found');

    const totalCost = latestPrice.price * quantity;
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');

    const portfolio = await this.portfolioRepository.findPortfolioByUserId(userId);
    if (!portfolio) throw new BadRequestError('Portfolio not found');

    const portfolioId = portfolio.portfolio_id;

    if (user.balance < totalCost) throw new Error('Insufficient balance');

    const trade: TradeCreationAttributes = {
      portfolio_id: portfolioId,
      share_id: share_id,
      quantity,
      price: latestPrice.price,
      trade_type: 'BUY',
      price_type: 'MARKET',
    };

    return this.tradeRepository.createTrade(trade);
  }

  /**
   * Sell shares at market price.
   * @param userId - The ID of the user.
   * @param shareId - The ID of the share.
   * @param quantity - The quantity of shares to sell.
   * @returns A promise that resolves to the created trade.
   */
  public async sellMarket(userId: number, data: TradeCreationRequest): Promise<Trade> {
    const { share_id, quantity } = data;
    const latestPrice = await this.priceRepository.findLatestPrice(share_id);
    if (!latestPrice) throw new BadRequestError('Market price not found');

    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');

    const portfolio = await this.portfolioRepository.findPortfolioByUserId(userId);
    if (!portfolio) throw new BadRequestError('Portfolio not found');
    const portfolioId = portfolio.portfolio_id;

    //check enough shares
    const shares = await this.portfolioRepository.findPortfolioHoldingsByPortfolioAndShareId(portfolioId, share_id);
    const totalShares = shares?.quantity || 0;
    if (totalShares < quantity) throw new Error('Insufficient shares');

    const trade: TradeCreationAttributes = {
      portfolio_id: portfolioId,
      share_id: share_id,
      quantity,
      price: latestPrice.price,
      trade_type: 'SELL',
      price_type: 'MARKET',
    };

    return this.tradeRepository.createTrade(trade);
  }

  /**
   * Place a limit buy order.
   * @param userId - The ID of the user.
   * @param shareId - The ID of the share.
   * @param price - The limit price.
   * @param quantity - The quantity of shares to buy.
   * @returns A promise that resolves to the created trade.
   */
  public async buyLimit(userId: number, shareId: number, price: number, quantity: number): Promise<Trade> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');

    const portfolio = await this.portfolioRepository.findPortfolioByUserId(userId);
    if (!portfolio) throw new BadRequestError('Portfolio not found');
    const portfolioId = portfolio.portfolio_id;

    const trade: TradeCreationAttributes = {
      portfolio_id: portfolioId,
      share_id: shareId,
      quantity,
      price,
      trade_type: 'BUY',
      price_type: 'LIMIT',
    };

    return this.tradeRepository.createTrade(trade);
  }

  /**
   * Place a limit sell order.
   * @param userId - The ID of the user.
   * @param shareId - The ID of the share.
   * @param price - The limit price.
   * @param quantity - The quantity of shares to sell.
   * @returns A promise that resolves to the created trade.
   */
  public async sellLimit(userId: number, shareId: number, price: number, quantity: number): Promise<Trade> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');

    const portfolio = await this.portfolioRepository.findPortfolioByUserId(userId);
    if (!portfolio) throw new BadRequestError('Portfolio not found');
    const portfolioId = portfolio.portfolio_id;

    const trade: TradeCreationAttributes = {
      portfolio_id: portfolioId,
      share_id: shareId,
      quantity,
      price,
      trade_type: 'SELL',
      price_type: 'LIMIT',
    };

    return this.tradeRepository.createTrade(trade);
  }

  /**
   * Get market trades with pagination.
   *
   * @param userId - The ID of the user.
   * @param page - The page number.
   * @param limit - The number of trades per page.
   * @param tradeType - The type of trade (optional).
   * @returns A promise that resolves to the paginated list of trades.
   */
  public async getMarketTrades(
    userId: number,
    page: number,
    limit: number,
    tradeType?: string,
  ): Promise<{ trades: Trade[]; total: number }> {
    const getUserPortfolio = await this.portfolioRepository.findPortfolioByUserId(userId);
    if (!getUserPortfolio) throw new NotFoundError('Portfolio not found');

    const portfolioId = getUserPortfolio.portfolio_id;

    return this.tradeRepository.getMarketTrades(portfolioId, page, limit, tradeType);
  }
}

export default TradeService;
