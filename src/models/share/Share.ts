import { Model, DataTypes, Optional } from 'sequelize';
import { SequelizeConnection } from '../../database';
import Trade from '../trade/Trade';
import PortfolioHoldings from '../portfolio/PortfolioHoldings';
import SharePrice from './SharePrice';
import { updateOrdersAndInsertTradeHook } from './hook';

// Define the attributes for the Share model
interface ShareAttributes {
  share_id: number;
  symbol: string;
  name: string;
  latest_price: number;
}

// Define the creation attributes for the Share model
type ShareCreationAttributes = Optional<ShareAttributes, 'share_id'>;

// Define the Share model class
class Share extends Model<ShareAttributes, ShareCreationAttributes> implements ShareAttributes {
  public share_id!: number;
  public symbol!: string;
  public name!: string;
  public latest_price!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(): void {
    // Define associations here if needed
    Share.hasMany(Trade, { foreignKey: 'share_id' });
    Share.hasMany(PortfolioHoldings, { foreignKey: 'share_id' });
    Share.hasMany(SharePrice, { foreignKey: 'share_id' });
  }
}
const sequelizeConnection = SequelizeConnection.getInstance();

// Initialize the Share model
Share.init(
  {
    share_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      unique: true,
      validate: {
        isUppercase: true,
        len: [3, 3],
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    latest_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    hooks: {
      beforeUpdate: updateOrdersAndInsertTradeHook,
      beforeCreate: updateOrdersAndInsertTradeHook,
    },
    sequelize: sequelizeConnection,
    tableName: 'shares',
    timestamps: true, // Enable timestamps
  },
);

export default Share;
