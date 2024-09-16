module.exports = {
  up: async (queryInterface) => {
    // Create a function to automatically update timestamps
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create triggers for each table to use the update_timestamp function
    const tables = ['users', 'portfolios', 'shares', 'portfolio_holdings', 'transactions', 'trades', 'share_prices'];
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        CREATE TRIGGER trg_update_${table}_timestamp
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
      `);
    }
  },

  down: async (queryInterface) => {
    // Drop triggers and functions
    const tables = ['users', 'portfolios', 'shares', 'portfolio_holdings', 'transactions', 'trades', 'share_prices'];
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS trg_update_${table}_timestamp ON ${table};
      `);
    }

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_timestamp();
    `);
  },
};
