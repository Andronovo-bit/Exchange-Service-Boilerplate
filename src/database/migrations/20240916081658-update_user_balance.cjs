'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Create the function first
    await queryInterface.sequelize.query(`
CREATE OR REPLACE FUNCTION "public"."update_user_balance"()
RETURNS "pg_catalog"."trigger" AS $BODY$
DECLARE
    portfolio_user_id INT;
    new_total_value DECIMAL;
    portfolio_row RECORD; -- Declared as a record to hold the entire row in the loop
BEGIN
    -- 1. Update user balance when a transaction occurs (DEPOSIT or WITHDRAWAL)
    IF TG_TABLE_NAME = 'transactions' THEN
        -- Check if this is an INSERT or UPDATE on the transactions table
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            -- If the transaction is a deposit, increment the user's balance
            IF NEW.transaction_type = 'DEPOSIT' THEN
                UPDATE users
                SET balance = balance + NEW.amount
                WHERE id = NEW.user_id;
            
            -- If the transaction is a withdrawal, ensure user has sufficient balance
            ELSIF NEW.transaction_type = 'WITHDRAWAL' THEN
                IF (SELECT balance FROM users WHERE id = NEW.user_id) < NEW.amount THEN
                    RAISE EXCEPTION 'Insufficient balance for withdrawal';
                END IF;

                -- Decrement the user's balance
                UPDATE users
                SET balance = balance - NEW.amount
                WHERE id = NEW.user_id;
            END IF;
        END IF;
    END IF;

    -- 2. Update balance based on changes to trades in portfolios
    IF TG_TABLE_NAME = 'trades' AND (TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        -- Fetch the related portfolio's user_id
        SELECT user_id INTO portfolio_user_id FROM portfolios WHERE portfolio_id = NEW.portfolio_id;

        -- Update user's balance based on trade type
        IF NEW.trade_type = 'BUY' THEN
            -- Decrease user's balance by the trade's total amount (quantity * price)
            UPDATE users
            SET balance = balance - (NEW.quantity * NEW.price)
            WHERE id = portfolio_user_id;
        ELSIF NEW.trade_type = 'SELL' THEN
            -- Increase user's balance by the trade's total amount (quantity * price)
            UPDATE users
            SET balance = balance + (NEW.quantity * NEW.price)
            WHERE id = portfolio_user_id;
        END IF;
    END IF;

    -- 3. Adjust the user's balance if the share price changes (for portfolio holdings)
    IF TG_TABLE_NAME = 'share_prices' AND (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        -- For each portfolio holding that includes the share, recalculate the total value and update the user's balance
        FOR portfolio_row IN
            SELECT * FROM portfolio_holdings WHERE share_id = NEW.share_id
        LOOP
            -- Calculate new total value for the holding based on the updated share price
            new_total_value := portfolio_row.quantity * NEW.price;

            -- Update the portfolio holding's total value
            UPDATE portfolio_holdings
            SET total_value = new_total_value
            WHERE portfolio_id = portfolio_row.portfolio_id AND share_id = portfolio_row.share_id;

            -- Fetch the portfolio user_id
            SELECT user_id INTO portfolio_user_id FROM portfolios WHERE portfolio_id = portfolio_row.portfolio_id;

            -- Adjust user's balance based on the updated total value
            UPDATE users
            SET balance = balance + new_total_value - portfolio_row.total_value
            WHERE id = portfolio_user_id;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;


    `);

    // Add the trigger that calls the function when a row is inserted or updated in the transactions table
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_user_balance_trigger
      AFTER INSERT OR UPDATE ON transactions
      FOR EACH ROW
      EXECUTE FUNCTION update_user_balance();
    `);

    // Add the trigger that calls the function when a row is inserted or updated in the trades table
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_user_balance_trigger
      AFTER INSERT OR UPDATE OR DELETE ON trades
      FOR EACH ROW
      EXECUTE FUNCTION update_user_balance();
    `);

    // Add the trigger that calls the function when a row is inserted or updated in the share_prices table
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_user_balance_trigger
      AFTER INSERT OR UPDATE ON share_prices
      FOR EACH ROW
      EXECUTE FUNCTION update_user_balance();
    `);
  },

  down: async (queryInterface) => {
    // Remove the trigger
    await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS update_user_balance_trigger ON transactions;
        `);

    await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS update_user_balance_trigger ON trades;
        `);

    await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS update_user_balance_trigger ON share_prices;
        `);

    // Remove the function
    await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS update_user_balance;
    `);
  },
};
