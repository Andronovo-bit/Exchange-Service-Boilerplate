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
   * @param shareId - The ID of the share.
   * @param price - The price of the order.
   * @param quantity - The quantity of the order.
   * @param orderType - The type of the order (BUY or SELL).
   * @returns A promise that resolves to the created order.
   */
  public async createOrder(
    userId: number,
    shareId: number,
    price: number,
    quantity: number,
    orderType: 'BUY' | 'SELL',
  ): Promise<Order> {
    const portfolio = await this.portfolioRepository.findByUserId(userId);
    if (!portfolio.length) throw new Error('Portfolio not found');

    const portfolioId = portfolio[0].portfolio_id;

    const order = await this.orderRepository.create({
      portfolio_id: portfolioId,
      share_id: shareId,
      price,
      quantity,
      order_type: orderType,
      status: 'PENDING',
      remaining_quantity: quantity,
    });

    return order;
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