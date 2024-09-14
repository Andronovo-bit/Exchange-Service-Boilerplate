// index.ts veya models.ts gibi bir dosyada

import User from './User';
import Portfolio from './portfolio/Portfolio';
import Share from './share/Share';
import Trade from './trade/model';
import PortfolioHoldings from './portfolio/PortfolioHoldings';
import Transaction from './Transaction';
import SharePrice from './share/SharePrice';

// Relationships between User and Portfolio
User.hasOne(Portfolio, { foreignKey: 'user_id' });
Portfolio.belongsTo(User, { foreignKey: 'user_id' });

// Relationships between Portfolio and Trade
Portfolio.hasMany(Trade, { foreignKey: 'portfolio_id' });
Trade.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });

// Relationships between Share and Trade
Share.hasMany(Trade, { foreignKey: 'share_id' });
Trade.belongsTo(Share, { foreignKey: 'share_id' });

// Relationships between Portfolio and PortfolioHoldings
Portfolio.hasMany(PortfolioHoldings, { foreignKey: 'portfolio_id' });
PortfolioHoldings.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });

// Relationships between Share and PortfolioHoldings
Share.hasMany(PortfolioHoldings, { foreignKey: 'share_id' });
PortfolioHoldings.belongsTo(Share, { foreignKey: 'share_id' });

// Relationships between User and Transaction
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

// Relationships between Portfolio and Transaction
Share.hasMany(SharePrice, { foreignKey: 'share_id' });
SharePrice.belongsTo(Share, { foreignKey: 'share_id' });

export { User, Portfolio, Share, Trade, PortfolioHoldings, Transaction, SharePrice };

// Define an ordered array of models
const syncOrderedModels = [User, Portfolio, Transaction, Share, Trade, PortfolioHoldings, SharePrice];

export default syncOrderedModels;
