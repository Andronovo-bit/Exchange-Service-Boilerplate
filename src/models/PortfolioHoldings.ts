import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db/database';
import Portfolio from './Portfolio';
import Share from './Share';

// Define the attributes for the PortfolioHoldings model
interface PortfolioHoldingsAttributes {
  holding_id: number;
  portfolio_id: number;
  share_id: number;
  quantity: number;
  average_price: number;
  total_value: number;
}

// Define the creation attributes for the PortfolioHoldings model
type PortfolioHoldingsCreationAttributes = Optional<PortfolioHoldingsAttributes, 'holding_id'>

// Define the PortfolioHoldings model class
class PortfolioHoldings extends Model<PortfolioHoldingsAttributes, PortfolioHoldingsCreationAttributes> implements PortfolioHoldingsAttributes {
  public holding_id!: number;
  public portfolio_id!: number;
  public share_id!: number;
  public quantity!: number;
  public average_price!: number;
  public total_value!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the PortfolioHoldings model
PortfolioHoldings.init(
  {
    holding_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    portfolio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Portfolio,
        key: 'portfolio_id',
      },
    },
    share_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Share,
        key: 'share_id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    average_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    total_value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize: sequelize,
    tableName: 'portfolio_holdings',
    timestamps: true, // Enable timestamps
  },
);

export default PortfolioHoldings;