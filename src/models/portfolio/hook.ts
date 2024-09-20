import PortfolioHoldings from './PortfolioHoldings'; // Import the PortfolioHoldings model
import Portfolio from './Portfolio'; // Import the Portfolio model
import { NotFoundError } from '../../utils/errors';

// Hook function to update Portfolio balance based on PortfolioHoldings changes
export const updatePortfolioBalanceHook = async (portfolioHoldings: PortfolioHoldings) => {
  let balance = 0;

  const allPortfolioHoldings:any = await Portfolio.findOne({
    where: { portfolio_id: portfolioHoldings.portfolio_id },
    include: [PortfolioHoldings],
  });

  if (!allPortfolioHoldings) {
    throw new NotFoundError(`Portfolio not found`);
  }

  allPortfolioHoldings.PortfolioHoldings.forEach((holding: PortfolioHoldings) => {
    balance += holding.quantity * holding.average_price;
  });

  allPortfolioHoldings.balance = balance;

  await allPortfolioHoldings.save();
};
