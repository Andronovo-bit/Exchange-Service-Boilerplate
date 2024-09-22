import { inject, injectable } from 'inversify';
import Order, { OrderAttributes, OrderCreationAttributes } from '../models/order/Order';
import { GenericRepository } from './generic/GenericRepository';
import { Op, Sequelize } from 'sequelize';

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

  /**
   * Get all orders with pagination.
   * @param portfolioId - The ID of the portfolio.
   * @param page - The page number.
   * @param limit - The number of orders per page.
   * @param orderType - The type of order (optional).
   * @returns A promise that resolves to the paginated list of orders.
   */
  public async getOrders(
    portfolioId: number,
    page: number,
    limit: number,
    orderType?: string,
    orderStates?: string[],
  ): Promise<{ orders: Order[]; total: number }> {
    const offset = (page - 1) * limit;

    const whereCondition: any = {
      order_type: orderType ? { [Op.eq]: orderType } : { [Op.in]: ['SELL', 'BUY'] },
      portfolio_id: portfolioId,
    };

    if (orderStates) {
      whereCondition.status = { [Op.in]: orderStates };
    }

    const { rows: orders, count: total } = await Order.findAndCountAll({
      where: whereCondition,
      order: [['order_date', 'DESC']],
      limit,
      offset,
    });

    return { orders, total };
  }
}

export default OrderRepository;
