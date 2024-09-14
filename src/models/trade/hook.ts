import PortfolioHolding from '../portfolio/PortfolioHoldings';
import Trade from './model';

async function getLatestPrice(share_id: number): Promise<number> {
  // Implement fetching the latest price from the `shares` table or any external API
  // For now, let's assume a static value for the sake of simplicity
  return 100.0; // This is just a placeholder; implement your own logic here.
}

Trade.addHook('beforeCreate', async (trade: Trade, options: any) => {
  const { portfolio_id, share_id, quantity, price, trade_type } = trade;

  const holding = await PortfolioHolding.findOne({
    where: { portfolio_id, share_id },
  });

  // Fetch the latest price
  const latestPrice = await getLatestPrice(share_id);

  if (trade_type === 'BUY') {
    // Buy operation
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
  } else if (trade_type === 'SELL') {
    // Sell operation
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
});
