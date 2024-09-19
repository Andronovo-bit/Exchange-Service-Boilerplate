import Share from '../share/Share'; // Adjust this import to match your project structure
import Order from '../order/Order';
import Trade from '../trade/Trade';
import { Op, Transaction } from 'sequelize';
import SharePrice from '../share/SharePrice';
import sequelize from '../../config/database/sequelize';
import Portfolio from '../portfolio/Portfolio';
import PortfolioHoldings from '../portfolio/PortfolioHoldings';
import { NotFoundError } from '../../utils/errors';

/**
 * Hook to be executed when `latest_price` in `Share` is updated.
 * @param share - The share instance with the updated price.
 */
export const updateOrdersAndInsertTradeHook = async (share: Share): Promise<void> => {
  // Only proceed if the price has changed
  //   if (!share.changed()) return;

  const latestPrice = share.latest_price;
  const shareId = share.share_id;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Process Orders
    await processOrders(shareId, latestPrice, transaction);

    // Commit the transaction
    await transaction.commit();
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    throw error;
  }
};

/**
 * Process orders based on the share ID and latest price.
 * @param shareId - The ID of the share.
 * @param latestPrice - The latest price of the share.
 * @param transaction - The transaction object.
 */
const processOrders = async (shareId: number, latestPrice: number, transaction: Transaction): Promise<void> => {
  const orders = await Order.findAll({
    where: {
      status: ['PENDING', 'PARTIALLY_COMPLETED'],
      share_id: shareId,
      price: {
        [Op.between]: [
          0.25 * latestPrice,
          1.25 * latestPrice, // %25 range for the price
        ],
      },
    },
    transaction,
  });

  // Group orders by price
  const groupedOrders = groupOrdersByPrice(orders);

  for (const price in groupedOrders) {
    const ordersAtPrice = groupedOrders[price];

    const { buyOrders, sellOrders } = groupOrdersByType(ordersAtPrice);

    // Process trades
    await processTrades(buyOrders, sellOrders, Number(price), transaction);
  }
};

/**
 * Group orders by their price.
 * @param orders - The array of orders to group.
 * @returns An object with orders grouped by price.
 */
const groupOrdersByPrice = (orders: Order[]): Record<number, Order[]> => {
  return orders.reduce((acc, order) => {
    acc[order.price] = acc[order.price] || [];
    acc[order.price].push(order);
    return acc;
  }, {} as Record<number, Order[]>);
};

/**
 * Group orders by their type (BUY or SELL).
 * @param orders - The array of orders to group.
 * @returns An object with buy and sell orders grouped separately.
 */
const groupOrdersByType = (orders: Order[]): { buyOrders: Order[]; sellOrders: Order[] } => {
  return orders.reduce(
    (acc, order) => {
      if (order.order_type === 'BUY') {
        acc.buyOrders.push(order);
      } else {
        acc.sellOrders.push(order);
      }
      return acc;
    },
    { buyOrders: [], sellOrders: [] } as { buyOrders: Order[]; sellOrders: Order[] },
  );
};

/**
 * Process trades between buy and sell orders.
 * @param buyOrders - The array of buy orders.
 * @param sellOrders - The array of sell orders.
 * @param price - The price at which the trades are executed.
 * @param transaction - The transaction object.
 */
const processTrades = async (
  buyOrders: Order[],
  sellOrders: Order[],
  price: number,
  transaction: Transaction,
): Promise<void> => {
  while (buyOrders.length > 0 && sellOrders.length > 0) {
    const buyOrder = buyOrders.shift()!;
    const sellOrder = sellOrders.shift()!;

    const quantity = Math.min(buyOrder.remaining_quantity, sellOrder.remaining_quantity);

    await createTrade(buyOrder, 'BUY', quantity, price, transaction);
    await createTrade(sellOrder, 'SELL', quantity, price, transaction);

    await updateOrder(buyOrder, quantity, transaction);
    await updateOrder(sellOrder, quantity, transaction);
  }

  // Update remaining quantity for orders
  for (const order of [...buyOrders, ...sellOrders]) {
    await updateOrder(order, 0, transaction);
  }
};

/**
 * Create a trade record.
 * @param order - The order to create a trade for.
 * @param tradeType - The type of the trade ('BUY' or 'SELL').
 * @param quantity - The quantity of the trade.
 * @param price - The price of the trade.
 * @param transaction - The transaction object.
 */
const createTrade = async (
  order: Order,
  tradeType: 'BUY' | 'SELL',
  quantity: number,
  price: number,
  transaction: Transaction,
): Promise<void> => {
  await Trade.create(
    {
      portfolio_id: order.portfolio_id,
      share_id: order.share_id,
      trade_type: tradeType,
      quantity: quantity,
      price: price,
      price_type: 'LIMIT',
      trade_date: new Date(),
    },
    { transaction },
  );
};

/**
 * Update the order with the new quantity and status.
 * @param order - The order to update.
 * @param quantity - The quantity to deduct from the order.
 * @param transaction - The transaction object.
 */
const updateOrder = async (order: Order, quantity: number, transaction: Transaction): Promise<void> => {
  const newRemainingQuantity = order.remaining_quantity - quantity;
  const newStatus = newRemainingQuantity === 0 ? 'COMPLETED' : 'PARTIALLY_COMPLETED';

  await order.update(
    {
      remaining_quantity: newRemainingQuantity,
      status: newStatus,
    },
    { transaction },
  );
};


/**
 * Hook to update the latest price of a share when a new share price is recorded.
 * @param sharePrice - The share price instance with the updated price.
 */
export const updateSharePriceHook = async (sharePrice: SharePrice): Promise<void> => {
  const { share_id: shareId, price: latestPrice } = sharePrice;

  const share = await Share.findOne({ where: { share_id: shareId } });

  if (!share) {
    throw new NotFoundError(`Share with ID ${shareId} not found`);
  }

  const previousPrice = share.latest_price;

  await share.update({ latest_price: latestPrice });

  const portfolios = await getPortfoliosWithHoldings(shareId);

  for (const portfolio of portfolios) {
    const holding = portfolio.PortfolioHoldings.find((h) => h.share_id === shareId) as PortfolioHoldings;

    const change = calculateChange(holding.quantity, latestPrice, previousPrice);
    const newBalance = Number(portfolio.balance) + Number(change);

    await portfolio.update({ balance: newBalance });
  }
};

/**
 * Get portfolios with holdings for a specific share.
 * @param shareId - The ID of the share.
 * @returns A promise that resolves to an array of portfolios with their holdings.
 */
const getPortfoliosWithHoldings = async (shareId: number): Promise<(Portfolio & { PortfolioHoldings: PortfolioHoldings[] })[]> => {
  return Portfolio.findAll({
    include: {
      model: PortfolioHoldings,
      where: { share_id: shareId },
    },
  }) as Promise<(Portfolio & { PortfolioHoldings: PortfolioHoldings[] })[]>;
};

/**
 * Calculate the change in value for a portfolio holding.
 * @param quantity - The quantity of shares.
 * @param latestPrice - The latest price of the share.
 * @param previousPrice - The previous price of the share.
 * @returns The change in value.
 */
const calculateChange = (quantity: number, latestPrice: number, previousPrice: number): number => {
  const currentValue = quantity * latestPrice;
  const previousValue = quantity * previousPrice;
  return currentValue - previousValue;
};