'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Create the function first
    await queryInterface.sequelize.query(`
CREATE OR REPLACE FUNCTION "public"."update_user_balance"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
DECLARE
    old_price DECIMAL;
    portfolio_user_id INT;
    price_difference DECIMAL;
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
        IF NEW.trade_type = 'BUY' AND NEW.price != OLD.price THEN
            -- Decrease user's balance by the trade's total amount (quantity * price)
            UPDATE users
            SET balance = balance - (NEW.quantity * NEW.price)
            WHERE id = portfolio_user_id;
        ELSIF NEW.trade_type = 'SELL' AND NEW.price != OLD.price THEN
            -- Increase user's balance by the trade's total amount (quantity * price)
            UPDATE users
            SET balance = balance + (NEW.quantity * NEW.price)
            WHERE id = portfolio_user_id;
        END IF;
    END IF;

		-- 3. Adjust the user's balance if the share price changes (for portfolio holdings)
		IF TG_TABLE_NAME = 'share_prices' AND (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
				-- Fetch the previous price of the share
				old_price := NULL;
				IF TG_OP = 'UPDATE' THEN
						-- For UPDATE operations, OLD.price is available
						old_price := OLD.price;
				ELSE
						-- For INSERT operations, fetch the latest price before the new one
						SELECT price INTO old_price
						FROM share_prices
						WHERE share_id = NEW.share_id AND recorded_at < NEW.recorded_at
						ORDER BY recorded_at DESC
						LIMIT 1;
				END IF;

				-- Handle case where there is no previous price
				IF old_price IS NULL THEN
						-- Assuming initial price is zero if no previous price exists
						old_price := 0;
				END IF;

				-- Calculate the price difference
				price_difference := NEW.price - old_price;

				-- Update the user's balance based on the change in total value for all holdings of this share
				UPDATE users u
				SET balance = balance + ph.total_quantity * price_difference
				FROM (
						SELECT p.user_id, SUM(ph.quantity) AS total_quantity
						FROM portfolio_holdings ph
						JOIN portfolios p ON ph.portfolio_id = p.portfolio_id
						WHERE ph.share_id = NEW.share_id
						GROUP BY p.user_id
				) ph
				WHERE u.id = ph.user_id;
				
				
			-- Update the latest_price in the shares table
			UPDATE shares
			SET latest_price = NEW.price
			WHERE share_id = NEW.share_id;
			
		END IF;

    RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
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
