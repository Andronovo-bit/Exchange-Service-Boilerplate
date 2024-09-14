import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database/database';
import User from './User';

// Define the attributes for the Transaction model
interface TransactionAttributes {
  transaction_id: number;
  user_id: number;
  transaction_type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  description: string | null;
  transaction_date: Date;
}

// Define the creation attributes for the Transaction model
type TransactionCreationAttributes = Optional<TransactionAttributes, 'transaction_id' | 'transaction_date'>

// Define the Transaction model class
class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public transaction_id!: number;
  public user_id!: number;
  public transaction_type!: 'DEPOSIT' | 'WITHDRAWAL';
  public amount!: number;
  public description!: string | null;
  public transaction_date!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
// Initialize the Transaction model
Transaction.init(
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id', // Corrected the key to match the User model's primary key
      },
    },
    transaction_type: {
      type: DataTypes.ENUM('DEPOSIT', 'WITHDRAWAL'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'transactions',
    timestamps: true, // Enable timestamps
  },
);

export default Transaction;