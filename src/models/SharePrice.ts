import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db/database';
import Share from './Share';

// Define the attributes for the SharePrice model
interface SharePriceAttributes {
  price_id: number;
  share_id: number;
  price: number;
  recorded_at: Date;
}

// Define the creation attributes for the SharePrice model
type SharePriceCreationAttributes = Optional<SharePriceAttributes, 'price_id' | 'recorded_at'>

// Define the SharePrice model class
class SharePrice extends Model<SharePriceAttributes, SharePriceCreationAttributes> implements SharePriceAttributes {
  public price_id!: number;
  public share_id!: number;
  public price!: number;
  public readonly recorded_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the SharePrice model
SharePrice.init(
  {
    price_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    share_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Share,
        key: 'share_id',
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    recorded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'share_prices',
    timestamps: true, // Enable timestamps
  },
);

export default SharePrice;