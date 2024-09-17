import { Model, DataTypes, Optional } from 'sequelize';
import { SequelizeConnection } from '../../database';
import Share from './Share';

// Define the attributes for the SharePrice model
export interface SharePriceAttributes {
  price_id: number;
  share_id: number;
  price: number;
  recorded_at: Date;
}

// Define the creation attributes for the SharePrice model
export type SharePriceCreationAttributes = Optional<SharePriceAttributes, 'price_id' | 'recorded_at'>;

// Define the SharePrice model class
class SharePrice extends Model<SharePriceAttributes, SharePriceCreationAttributes> implements SharePriceAttributes {
  public price_id!: number;
  public share_id!: number;
  public price!: number;
  public readonly recorded_at!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(): void {
    // Define associations here if needed
    SharePrice.belongsTo(Share, { foreignKey: 'share_id' });
  }
}

const sequelizeConnection = SequelizeConnection.getInstance();

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
    sequelize: sequelizeConnection,
    tableName: 'share_prices',
    timestamps: true, // Enable timestamps
  },
);

export default SharePrice;
