// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

const options = {
  individualHooks: true,
  // other properties...
};

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Hash passwords with bcrypt
      const hashedPasswords = await Promise.all(
        ['password1', 'password2', 'password3', 'password4', 'password5'].map((pwd) => bcrypt.hash(pwd, saltRounds)),
      );

      // Insert users
      const userData = [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: hashedPasswords[0],
          createdAt: new Date(),
          updatedAt: new Date(),
          balance: 0,
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: hashedPasswords[1],
          createdAt: new Date(),
          updatedAt: new Date(),
          balance: 0,
        },
        {
          username: 'user3',
          email: 'user3@example.com',
          password: hashedPasswords[2],
          createdAt: new Date(),
          updatedAt: new Date(),
          balance: 0,
        },
        {
          username: 'user4',
          email: 'user4@example.com',
          password: hashedPasswords[3],
          createdAt: new Date(),
          updatedAt: new Date(),
          balance: 0,
        },
        {
          username: 'user5',
          email: 'user5@example.com',
          password: hashedPasswords[4],
          createdAt: new Date(),
          updatedAt: new Date(),
          balance: 0,
        },
      ];

      await queryInterface.bulkInsert('users', userData, { ...options, transaction });

      const usersQuery = await queryInterface.sequelize.query(`SELECT id FROM users;`, {
        transaction,
      });
      const userRows = usersQuery[0];

      // Insert transactions (DEPOSIT)
      const transactionsDepositData = [
        // User 1
        {
          user_id: userRows[0].id,
          transaction_type: 'DEPOSIT',
          amount: 100000,
          description: 'Initial deposit',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 2
        {
          user_id: userRows[1].id,
          transaction_type: 'DEPOSIT',
          amount: 150000,
          description: 'Trading capital',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 3
        {
          user_id: userRows[2].id,
          transaction_type: 'DEPOSIT',
          amount: 80000,
          description: 'Investment funds',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 4
        {
          user_id: userRows[3].id,
          transaction_type: 'DEPOSIT',
          amount: 50000,
          description: 'Starting investment',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 5
        {
          user_id: userRows[4].id,
          transaction_type: 'DEPOSIT',
          amount: 120000,
          description: 'Initial funds',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert('transactions', transactionsDepositData, {
        ...options,
        transaction,
      });

      // Insert shares with correct symbols
      const shareData = [
        {
          symbol: 'APL',
          name: 'Apple Inc.',
          latest_price: 150.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          symbol: 'TSL',
          name: 'Tesla Inc.',
          latest_price: 700.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          symbol: 'GGL',
          name: 'Alphabet Inc.',
          latest_price: 2800.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          symbol: 'AZN',
          name: 'Amazon.com, Inc.',
          latest_price: 3400.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          symbol: 'MST',
          name: 'Microsoft Corporation',
          latest_price: 290.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert('shares', shareData, { ...options, transaction });

      // Get shares and share IDs from the database
      const sharesQuery = await queryInterface.sequelize.query(`SELECT share_id, symbol FROM shares;`, { transaction });
      const shareRows = sharesQuery[0];

      // Insert share prices
      const sharePricesData = shareRows.map((share) => ({
        share_id: share.share_id,
        price: shareData.find((s) => s.symbol === share.symbol).latest_price,
        recorded_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert('share_prices', sharePricesData, {
        ...options,
        transaction,
      });

      // Insert portfolios

      const portfolioData = userRows.map((user) => ({
        user_id: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert('portfolios', portfolioData, {
        ...options,
        transaction,
      });

      // Get portfolios and their IDs from the database
      const portfolioQuery = await queryInterface.sequelize.query(`SELECT portfolio_id, user_id FROM portfolios;`, {
        transaction,
      });
      const portfolioRows = portfolioQuery[0];

      // Insert trades (BUY and SELL)
      const tradesData = [
        // User 1 buys and sells AAPL
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[0].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'APL').share_id,
          trade_type: 'BUY',
          quantity: 50,
          price: 150.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[0].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'APL').share_id,
          trade_type: 'SELL',
          quantity: 20,
          price: 155.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 2 buys TSLA
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[1].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'TSL').share_id,
          trade_type: 'BUY',
          quantity: 10,
          price: 700.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 3 buys and sells GOOGL
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[2].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'GGL').share_id,
          trade_type: 'BUY',
          quantity: 1,
          price: 2800.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[2].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'GGL').share_id,
          trade_type: 'SELL',
          quantity: 1,
          price: 2850.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 4 buys MSFT
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[3].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'MST').share_id,
          trade_type: 'BUY',
          quantity: 15,
          price: 290.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 5 buys and sells AMZN
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[4].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'AZN').share_id,
          trade_type: 'BUY',
          quantity: 3,
          price: 3400.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[4].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'AZN').share_id,
          trade_type: 'SELL',
          quantity: 1,
          price: 3450.0,
          price_type: 'MARKET',
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert('trades', tradesData, { ...options, transaction });

      // Update portfolio_holdings accordingly
      const portfolioHoldingsData = [
        // User 1 holdings
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[0].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'APL').share_id,
          quantity: 30, // 50 bought - 20 sold
          average_price: (50 * 150.0 - 20 * 155.0) / 30, // Net cost divided by remaining quantity
          //total_value: 30 * 155.0, // Assuming current price is 155.0
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 2 holdings
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[1].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'TSL').share_id,
          quantity: 10,
          average_price: 700.0,
          //total_value: 10 * 700.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 3 holdings
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[2].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'GGL').share_id,
          quantity: 3, // 5 bought - 2 sold
          average_price: (5 * 2800.0 - 2 * 2850.0) / 3, // Net cost divided by remaining quantity
          //total_value: 3 * 2850.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 4 holdings
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[3].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'MST').share_id,
          quantity: 15,
          average_price: 290.0,
          //total_value: 15 * 290.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 5 holdings
        {
          portfolio_id: portfolioRows.find((p) => p.user_id === userRows[4].id).portfolio_id,
          share_id: shareRows.find((s) => s.symbol === 'AZN').share_id,
          quantity: 2, // 3 bought - 1 sold
          average_price: (3 * 3400.0 - 1 * 3450.0) / 2, // Net cost divided by remaining quantity
          //total_value: 2 * 3450.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert('portfolio_holdings', portfolioHoldingsData, {
        ...options,
        transaction,
      });

      // Insert transactions (DEPOSIT)
      const transactionsWithDrawalData = [
        // User 1
        {
          user_id: userRows[0].id,
          transaction_type: 'WITHDRAWAL',
          amount: 2000,
          description: 'Withdrawal for personal use',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 2
        {
          user_id: userRows[1].id,
          transaction_type: 'WITHDRAWAL',
          amount: 1500,
          description: 'Trading capital',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 3
        {
          user_id: userRows[2].id,
          transaction_type: 'WITHDRAWAL',
          amount: 3000,
          description: 'Partial withdrawal',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 4
        {
          user_id: userRows[3].id,
          transaction_type: 'WITHDRAWAL',
          amount: 5000,
          description: 'Starting investment',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // User 5
        {
          user_id: userRows[4].id,
          transaction_type: 'WITHDRAWAL',
          amount: 4000,
          description: 'Emergency withdrawal',
          transaction_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert('transactions', transactionsWithDrawalData, {
        ...options,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Seed data insertion failed:', error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Rollback inserted data in the correct order
      await queryInterface.bulkDelete('portfolio_holdings', null, {
        ...options,
        transaction,
      });
      await queryInterface.bulkDelete('trades', null, { ...options, transaction });
      await queryInterface.bulkDelete('transactions', null, { ...options, transaction });
      await queryInterface.bulkDelete('share_prices', null, { ...options, transaction });
      await queryInterface.bulkDelete('portfolios', null, { ...options, transaction });
      await queryInterface.bulkDelete('shares', null, { ...options, transaction });
      await queryInterface.bulkDelete('users', null, { ...options, transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Seed data deletion failed:', error);
      throw error;
    }
  },
};
