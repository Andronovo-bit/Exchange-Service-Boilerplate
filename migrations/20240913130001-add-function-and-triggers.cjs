'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Create a function to automatically update timestamps
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create a function to update portfolio holdings
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_portfolio_holdings()
      RETURNS TRIGGER AS $$
      DECLARE
          current_quantity INTEGER;
          current_average_price NUMERIC(10,2);
      BEGIN
          IF TG_OP = 'INSERT' THEN
              IF NEW.trade_type = 'BUY' THEN
                  -- Buy operation
                  INSERT INTO portfolio_holdings (portfolio_id, share_id, quantity, average_price, total_value)
                  VALUES (NEW.portfolio_id, NEW.share_id, NEW.quantity, NEW.price, NEW.quantity * NEW.price)
                  ON CONFLICT (portfolio_id, share_id)
                  DO UPDATE SET
                      quantity = portfolio_holdings.quantity + EXCLUDED.quantity,
                      average_price = ((portfolio_holdings.quantity * portfolio_holdings.average_price) + (EXCLUDED.quantity * EXCLUDED.average_price)) / (portfolio_holdings.quantity + EXCLUDED.quantity),
                      total_value = (portfolio_holdings.quantity + EXCLUDED.quantity) * (SELECT latest_price FROM shares WHERE share_id = NEW.share_id),
                      updated_at = NOW();
              ELSIF NEW.trade_type = 'SELL' THEN
                  -- Sell operation
                  UPDATE portfolio_holdings
                  SET quantity = quantity - NEW.quantity,
                      total_value = (quantity - NEW.quantity) * (SELECT latest_price FROM shares WHERE share_id = NEW.share_id),
                      updated_at = NOW()
                  WHERE portfolio_id = NEW.portfolio_id AND share_id = NEW.share_id;
              END IF;
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create triggers for each table to use the update_timestamp function
    const tables = ['users', 'portfolios', 'shares', 'portfolio_holdings'];
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
    const tables = ['users', 'portfolios', 'shares', 'portfolio_holdings'];
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS trg_update_${table}_timestamp ON ${table};
      `);
    }
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_timestamp();
    `);
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_portfolio_holdings();
    `);
  },
};