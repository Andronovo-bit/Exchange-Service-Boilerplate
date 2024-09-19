import PortfolioHoldings  from './PortfolioHoldings'; // Import the PortfolioHoldings model
import Portfolio  from './Portfolio'; // Import the Portfolio model

// Hook function to update Portfolio balance based on PortfolioHoldings changes
export const updatePortfolioBalanceHook = async (portfolioHoldings: PortfolioHoldings) => {
  const portfolioId = portfolioHoldings.portfolio_id;

  // Calculate the sum of total_value for all holdings in this portfolio
  const totalValue = await portfolioHoldings.getDataValue('total_value');

  // Update the Portfolio balance with the new total value
  await Portfolio.update({ balance: totalValue }, { where: { portfolio_id: portfolioId } });

};
