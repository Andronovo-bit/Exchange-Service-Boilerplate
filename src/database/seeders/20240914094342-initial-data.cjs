// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

module.exports = {
  up: async (queryInterface) => {
    // Hash passwords with bcrypt
    const hashedPassword1 = await bcrypt.hash('password1', saltRounds);
    const hashedPassword2 = await bcrypt.hash('password2', saltRounds);
    const hashedPassword3 = await bcrypt.hash('password3', saltRounds);
    const hashedPassword4 = await bcrypt.hash('password4', saltRounds);
    const hashedPassword5 = await bcrypt.hash('password5', saltRounds);

    // Insert users
    await queryInterface.bulkInsert('users', [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: hashedPassword1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: hashedPassword3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user4',
        email: 'user4@example.com',
        password: hashedPassword4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user5',
        email: 'user5@example.com',
        password: hashedPassword5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert shares
    const shares = await queryInterface.bulkInsert('shares', [
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
        symbol: 'GOG',
        name: 'Google LLC',
        latest_price: 2800.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Get shares and share IDs from the database
    const sharesQuery = await queryInterface.sequelize.query(`SELECT share_id FROM "shares";`);
    const shareRows = sharesQuery[0];

    // Insert share prices
    await queryInterface.bulkInsert('share_prices', [
      {
        share_id: shareRows[0].share_id,
        price: 150.0,
        recorded_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        share_id: shareRows[1].share_id,
        price: 700.0,
        recorded_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        share_id: shareRows[2].share_id,
        price: 2800.0,
        recorded_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert portfolios
    const usersQuery = await queryInterface.sequelize.query(`SELECT id FROM "users";`);
    const userRows = usersQuery[0];

    await queryInterface.bulkInsert('portfolios', [
      { user_id: userRows[0].id, createdAt: new Date(), updatedAt: new Date() },
      { user_id: userRows[1].id, createdAt: new Date(), updatedAt: new Date() },
      { user_id: userRows[2].id, createdAt: new Date(), updatedAt: new Date() },
      { user_id: userRows[3].id, createdAt: new Date(), updatedAt: new Date() },
      { user_id: userRows[4].id, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert transactions
    await queryInterface.bulkInsert('transactions', [
      {
        user_id: userRows[0].id,
        transaction_type: 'DEPOSIT',
        amount: 5000,
        description: 'Initial deposit',
        transaction_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userRows[1].id,
        transaction_type: 'DEPOSIT',
        amount: 10000,
        description: 'Trading funds',
        transaction_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userRows[2].id,
        transaction_type: 'DEPOSIT',
        amount: 7500,
        transaction_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Get portfolios and their IDs from the database
    const portfolioQuery = await queryInterface.sequelize.query(`SELECT portfolio_id FROM "portfolios";`);
    const portfolioRows = portfolioQuery[0];
    console.log(portfolioRows);

    // Insert trades
    await queryInterface.bulkInsert(
      'trades',
      [
        {
          portfolio_id: portfolioRows[0].portfolio_id,
          share_id: shareRows[0].share_id,
          trade_type: 'BUY',
          quantity: 10,
          price: 150.0,
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          portfolio_id: portfolioRows[1].portfolio_id,
          share_id: shareRows[1].share_id,
          trade_type: 'BUY',
          quantity: 5,
          price: 700.0,
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          portfolio_id: portfolioRows[2].portfolio_id,
          share_id: shareRows[2].share_id,
          trade_type: 'BUY',
          quantity: 2,
          price: 2800.0,
          trade_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options,
    );

    // Seed data for portfolio_holdings
    const portfoliosQuery = await queryInterface.sequelize.query(`SELECT portfolio_id FROM portfolios;`);
    const portfolios = portfoliosQuery[0];

    await queryInterface.bulkInsert('portfolio_holdings', [
      {
        portfolio_id: portfolios[0].portfolio_id,
        share_id: shareRows[0].share_id,
        quantity: 50,
        average_price: 150.0,
        total_value: 7500.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        portfolio_id: portfolios[1].portfolio_id,
        share_id: shareRows[1].share_id,
        quantity: 10,
        average_price: 700.0,
        total_value: 7000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        portfolio_id: portfolios[2].portfolio_id,
        share_id: shareRows[2].share_id,
        quantity: 2,
        average_price: 2800.0,
        total_value: 5600.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    // Rollback inserted data

    await queryInterface.bulkDelete('portfolio_holdings', null, {});
    await queryInterface.bulkDelete('portfolios', null, {});
    await queryInterface.bulkDelete('share_prices', {});
    await queryInterface.bulkDelete('trades', null, {});
    await queryInterface.bulkDelete('shares', null, {});
    await queryInterface.bulkDelete('transactions', {});
    await queryInterface.bulkDelete('users', {});
  },
};

const options = {
  individualHooks: true,
  // other properties...
};
