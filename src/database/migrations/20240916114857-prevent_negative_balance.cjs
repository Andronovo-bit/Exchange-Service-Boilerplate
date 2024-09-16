'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION prevent_negative_balance()
      RETURNS TRIGGER AS $$
      BEGIN
          -- Ensure the user has enough balance for the withdrawal
          IF ((SELECT balance FROM users WHERE id = NEW.user_id) < NEW.amount) THEN
              RAISE EXCEPTION 'Insufficient balance for this transaction. Cannot proceed. Please deposit more funds. NEW: %', NEW;
          END IF;

          -- If balance is sufficient, proceed with the update
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER prevent_negative_balance_trigger
      BEFORE UPDATE OR INSERT ON transactions
      FOR EACH ROW
      WHEN (NEW.transaction_type = 'WITHDRAWAL')
      EXECUTE FUNCTION prevent_negative_balance();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS prevent_negative_balance_trigger ON transactions;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS prevent_negative_balance;
    `);
  },
};
