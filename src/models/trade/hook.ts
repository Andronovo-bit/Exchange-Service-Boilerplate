import PortfolioHolding from '../../models/portfolio/PortfolioHoldings';
import SharePrice from '../share/SharePrice';
import Trade from './Trade';

/**
 * Get the latest price of a share.
 * @param shareId - The ID of the share.
 * @returns The latest price of the share.
 */
async function getLatestPrice(shareId: number): Promise<number> {
  const sharePrice = await SharePrice.findOne({
    where: { share_id: shareId },
    order: [['recorded_at', 'DESC']],
  });

  if (!sharePrice) {
    throw new Error(`Latest price not found for share ID ${shareId}.`);
  }

  return parseFloat(sharePrice.price.toString());
}

/**
 * Hook to handle trade operations.
 * @param trade - The trade instance.
 */
export const addTradeHook = async (trade: Trade): Promise<void> => {
  const { portfolio_id: portfolioId, share_id: shareId, trade_type: tradeType, quantity, price } = trade;

  const latestPrice = await getLatestPrice(shareId);
  const holding = await PortfolioHolding.findOne({ where: { portfolio_id: portfolioId, share_id: shareId } });

  if (tradeType === 'BUY') {
    await handleBuyOperation(holding, portfolioId, shareId, quantity, price, latestPrice);
  } else {
    await handleSellOperation(holding, quantity, price, latestPrice);
  }
};

/**
 * Handle buy operations for a portfolio holding.
 * @param holding - The portfolio holding instance.
 * @param portfolioId - The ID of the portfolio.
 * @param shareId - The ID of the share.
 * @param quantity - The quantity of shares.
 * @param price - The price of the shares.
 * @param latestPrice - The latest price of the share.
 */
async function handleBuyOperation(
  holding: PortfolioHolding | null,
  portfolioId: number,
  shareId: number,
  quantity: number,
  price: number,
  latestPrice: number,
): Promise<void> {
  if (!holding) {
    // No portfolio holding exists, so create a new one
    await PortfolioHolding.create({
      portfolio_id: portfolioId,
      share_id: shareId,
      quantity,
      average_price: price,
      total_value: quantity * price,
    });
  } else {
    // Update the existing portfolio holding
    const newQuantity = holding.quantity + quantity;
    const newAveragePrice = (holding.quantity * holding.average_price + quantity * price) / newQuantity;
    const newTotalValue = newQuantity * latestPrice;

    await holding.update({
      quantity: newQuantity,
      average_price: newAveragePrice,
      total_value: newTotalValue,
    });
  }
}

/**
 * Handle sell operations for a portfolio holding.
 * @param holding - The portfolio holding instance.
 * @param quantity - The quantity of shares to sell.
 * @param price - The price of the shares.
 * @param latestPrice - The latest price of the share.
 */
async function handleSellOperation(
  holding: PortfolioHolding | null,
  quantity: number,
  price: number,
  latestPrice: number,
): Promise<void> {
  if (!holding) {
    throw new Error('Cannot sell shares that are not in the portfolio.');
  }

  const newQuantity = holding.quantity - quantity;
  if (newQuantity < 0) {
    throw new Error('Cannot sell more than the available quantity.');
  }

  const newTotalValue = newQuantity * latestPrice;

  // Calculate the new average price
  let newAveragePrice = 0;
  if (newQuantity > 0) {
    newAveragePrice = (holding.total_value - price * quantity) / newQuantity;
  }

  await holding.update({
    quantity: newQuantity,
    total_value: newTotalValue,
    average_price: newAveragePrice,
  });

  // Update the existing portfolio holding
  // const newAveragePrice = (holding.quantity * holding.average_price + quantity * price) / newQuantity;
  // const newTotalValue = newQuantity * latestPrice;

  // await holding.update({
  //   quantity: newQuantity,
  //   average_price: newAveragePrice,
  //   total_value: newTotalValue,
  // });
}
