import { inject, injectable } from 'inversify';
import OrderRepository from '../repositories/OrderRepository';
import PortfolioRepository from '../repositories/PortfolioRepository';
import Order, { OrderAttributes, OrderCreationAttributes } from '../models/order/Order';
import { BaseService } from './BaseService';

@injectable()
class OrderService extends BaseService<Order, OrderAttributes, OrderCreationAttributes> {
  constructor(
    @inject(OrderRepository) private orderRepository: OrderRepository,
    @inject(PortfolioRepository) private portfolioRepository: PortfolioRepository,
  ) {
    super(orderRepository);
  }

  /**
   * Create a new limit order.
   * @param userId - The ID of the user.
   * @param data - The order creation attributes.
   * @returns A promise that resolves to the created order.
   */
  public async createOrder(userId: number, data: OrderCreationAttributes): Promise<Order> {
    const portfolio = await this.portfolioRepository.findPortfolioByUserId(userId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const { portfolio_id: portfolioId } = portfolio;

    if (!portfolioId) {
      throw new Error('Portfolio for the given share_id not found');
    }

    if (data.portfolio_id !== portfolioId) {
      throw new Error('Portfolio ID does not match the user portfolio ID');
    }

    return this.orderRepository.create(data);
  }

  /**
   * Get all pending limit orders for a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of pending orders.
   */
  public async getPendingOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.findPendingOrders(userId);
  }

  /**
   * Cancel a limit order.
   * @param orderId - The ID of the order to cancel.
   * @returns A promise that resolves to the cancelled order.
   */
  public async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findByPk(orderId);
    if (!order) throw new Error('Order not found');

    await order.update({ status: 'CANCELLED' });
    return order;
  }

  /**
   * Process a partially completed order.
   * @param orderId - The ID of the order.
   * @param processedQuantity - The quantity that has been processed.
   * @returns A promise that resolves to the updated order.
   */
  public async processPartialOrder(orderId: number, processedQuantity: number): Promise<Order> {
    const order = await this.orderRepository.findByPk(orderId);
    if (!order) throw new Error('Order not found');

    const remainingQuantity = order.quantity - processedQuantity;

    if (remainingQuantity > 0) {
      await order.update({
        quantity: remainingQuantity,
        status: 'PARTIALLY_COMPLETED',
      });
    } else {
      await order.update({ status: 'COMPLETED' });
    }

    return order;
  }

  /**
   * Mark an order as completed.
   * @param orderId - The ID of the order.
   * @returns A promise that resolves to the updated order.
   */
  public async completeOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findByPk(orderId);
    if (!order) throw new Error('Order not found');

    await order.update({ status: 'COMPLETED' });
    return order;
  }
}

export default OrderService;
