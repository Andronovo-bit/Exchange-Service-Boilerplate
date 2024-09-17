import { Model, DataTypes, Optional } from 'sequelize';
import { SequelizeConnection } from '../../database';
import User from '../user/User';

// Define the attributes for the Transaction model
export interface TransactionAttributes {
  transaction_id: number;
  user_id: number;
  transaction_type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  description: string | null;
  transaction_date: Date;
}

// Define the creation attributes for the Transaction model
export type TransactionCreationAttributes = Optional<TransactionAttributes, 'transaction_id' | 'transaction_date'>;

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

  // Associations
  public static associate(): void {
    // Define associations here if needed
    Transaction.belongsTo(User, { foreignKey: 'user_id' });
  }
}

const sequelizeConnection = SequelizeConnection.getInstance();

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
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 10,
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
    sequelize: sequelizeConnection,
    tableName: 'transactions',
    timestamps: true, // Enable timestamps
  },
);

export default Transaction;
