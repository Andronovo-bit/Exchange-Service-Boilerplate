import Share from '../share/Share'; // Adjust this import to match your project structure
import Order from '../order/Order';
import { Op } from 'sequelize';
import SharePrice from '../share/SharePrice';
import { NotFoundError } from '../../utils/errors';

/**
 * Hook to update the share price when an order is processed.
 * @param order - The order instance that triggered the hook.
 */
export const updateSharePriceHook = async (order: Order): Promise<void> => {
  const share = await Share.findOne({ where: { share_id: order.share_id } });

  if (!share) {
    throw new NotFoundError(`Share with ID ${order.share_id} not found`);
  }

  const pendingOppositeOrders = await findPendingOppositeOrders(order);

  if (pendingOppositeOrders.length === 0) {
    return;
  }

  const closestOrder = findClosestOrderToLatestPrice(pendingOppositeOrders, share.latest_price);

  if (closestOrder) {
    await recordSharePrice(order.share_id, closestOrder.price);
  }
};

/**
 * Find pending opposite orders for the given order.
 * @param order - The order instance to find opposite orders for.
 * @returns A promise that resolves to an array of opposite orders.
 */
const findPendingOppositeOrders = async (order: Order): Promise<Order[]> => {
  return Order.findAll({
    where: {
      share_id: order.share_id,
      status: ['PENDING', 'PARTIALLY_COMPLETED'],
      order_type: { [Op.not]: order.order_type },
      price: { [Op.eq]: order.price },
    },
    order: [['price', 'DESC']],
  });
};

/**
 * Find the order with the closest price to the latest share price.
 * @param orders - The array of orders to search through.
 * @param latestPrice - The latest price of the share.
 * @returns The order with the closest price to the latest share price.
 */
const findClosestOrderToLatestPrice = (orders: Order[], latestPrice: number): Order | undefined => {
  const priceDifferences = orders.map(order => Math.abs(latestPrice - order.price));
  const minPriceDifference = Math.min(...priceDifferences);
  return orders.find(order => Math.abs(latestPrice - order.price) === minPriceDifference);
};

/**
 * Record the share price in the SharePrice table.
 * @param shareId - The ID of the share.
 * @param price - The price to record.
 */
const recordSharePrice = async (shareId: number, price: number): Promise<void> => {
  await SharePrice.create({
    share_id: shareId,
    price,
    recorded_at: new Date(),
  });
};