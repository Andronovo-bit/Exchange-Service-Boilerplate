import PortfolioHolding from '../../models/portfolio/PortfolioHoldings';
import SharePrice from '../share/SharePrice';
import Trade from './Trade';

async function getLatestPrice(share_id: number): Promise<number> {
  const sharePrice = await SharePrice.findOne({
    where: { share_id },
    order: [['recorded_at', 'DESC']],
  });
  if (!sharePrice) {
    throw new Error('Latest price not found for the share.');
  }
  return parseFloat(sharePrice.price.toString());
}

export const addTradeHook = async (trade: Trade): Promise<void> => {
  const { portfolio_id, share_id, trade_type, quantity, price } = trade;

  const latestPrice = await getLatestPrice(share_id);
  const holding = await PortfolioHolding.findOne({ where: { portfolio_id, share_id } });

  if (trade_type === 'BUY') {
    await handleBuyOperation(holding, portfolio_id, share_id, quantity, price, latestPrice);
  } else {
    await handleSellOperation(holding, quantity, latestPrice);
  }
}

async function handleBuyOperation(
  holding: PortfolioHolding | null,
  portfolio_id: number,
  share_id: number,
  quantity: number,
  price: number,
  latestPrice: number,
): Promise<void> {
  if (!holding) {
    // No portfolio holding exists, so create a new one
    await PortfolioHolding.create({
      portfolio_id,
      share_id,
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

async function handleSellOperation(
  holding: PortfolioHolding | null,
  quantity: number,
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

  await holding.update({
    quantity: newQuantity,
    total_value: newTotalValue,
  });
}
