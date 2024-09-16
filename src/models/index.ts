// index.ts veya models.ts gibi bir dosyada

import User from './user/User';
import Portfolio from './portfolio/Portfolio';
import Share from './share/Share';
import Trade from './trade/Trade';
import PortfolioHoldings from './portfolio/PortfolioHoldings';
import Transaction from './transaction/Transaction';
import SharePrice from './share/SharePrice';

const syncOrderedModels = [User, Transaction, Portfolio, Share, Trade, PortfolioHoldings, SharePrice];

// Set up associations
Object.values(syncOrderedModels).forEach((model: any) => {
  if (typeof model.associate === 'function') {
    model.associate();
  }
});

export default syncOrderedModels;
