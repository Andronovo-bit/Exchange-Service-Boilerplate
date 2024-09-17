import { Model, DataTypes, Optional } from 'sequelize';
import { SequelizeConnection } from '../../database';
import Portfolio from '../portfolio/Portfolio';
import Share from '../share/Share';

// Define the attributes for the Trade model
export interface TradeAttributes {
  trade_id: number;
  portfolio_id: number;
  share_id: number;
  trade_type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  price_type: 'LIMIT' | 'MARKET';
  trade_date: Date;
}

// Define the creation attributes for the Trade model
export type TradeCreationAttributes = Optional<TradeAttributes, 'trade_id' | 'trade_date'>;

// Define the Trade model class
class Trade extends Model<TradeAttributes, TradeCreationAttributes> implements TradeAttributes {
  public trade_id!: number;
  public portfolio_id!: number;
  public share_id!: number;
  public trade_type!: 'BUY' | 'SELL';
  public quantity!: number;
  public price!: number;
  public price_type!: 'LIMIT' | 'MARKET';
  public trade_date!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(): void {
    // Define associations here if needed
    Trade.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });
    Trade.belongsTo(Share, { foreignKey: 'share_id' });
  }
}

const sequelizeConnection = SequelizeConnection.getInstance();

// Initialize the Trade model
Trade.init(
  {
    trade_id: {
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
    trade_type: {
      type: DataTypes.ENUM('BUY', 'SELL'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    price_type: {
      type: DataTypes.ENUM('LIMIT', 'MARKET'),
      allowNull: false,
    },
    trade_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'trades',
    timestamps: true, // Enable timestamps
  },
);

export default Trade;
