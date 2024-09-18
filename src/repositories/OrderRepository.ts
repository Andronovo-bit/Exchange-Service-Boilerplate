import { inject, injectable } from 'inversify';
import Order, { OrderAttributes, OrderCreationAttributes } from '../models/order/Order';
import { GenericRepository } from './generic/GenericRepository';
import { Sequelize } from 'sequelize';

@injectable()
class OrderRepository extends GenericRepository<Order, OrderAttributes, OrderCreationAttributes> {
  constructor(@inject('SequelizeInstance') private sequelizeInstance: Sequelize) {
    super(Order);
  }

  /**
   * Find all pending orders for a given portfolio.
   * @param portfolioId - The ID of the portfolio.
   * @returns A promise that resolves to an array of pending orders.
   */
  public async findPendingOrders(portfolioId: number): Promise<Order[]> {
    return this.model.findAll({
      where: {
        portfolio_id: portfolioId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Cancel an order by its ID.
   * @param orderId - The ID of the order to cancel.
   * @returns A promise that resolves to the number of affected rows.
   */
  public async cancelOrder(orderId: number): Promise<number> {
    const [affectedRows] = await this.model.update({ status: 'CANCELLED' }, { where: { order_id: orderId } });
    return affectedRows;
  }
}

export default OrderRepository;
