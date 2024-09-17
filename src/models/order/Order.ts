import { DataTypes, Model, Optional } from 'sequelize';
import Portfolio from '../portfolio/Portfolio';
import Share from '../share/Share';
import { SequelizeConnection } from '../../database';

// Define the attributes for the Order model
export interface OrderAttributes {
  order_id: number;
  portfolio_id: number;
  share_id: number;
  order_type: 'BUY' | 'SELL';
  quantity: number;
  remaining_quantity: number;
  price: number;
  order_date: Date;
  status: 'PENDING' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'CANCELLED';
}

// Define the creation attributes for the Order model
export type OrderCreationAttributes = Optional<OrderAttributes, 'order_id' | 'order_date'>;

// Define the Order model class
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public order_id!: number;
  public portfolio_id!: number;
  public share_id!: number;
  public order_type!: 'BUY' | 'SELL';
  public quantity!: number;
  public remaining_quantity!: number;
  public price!: number;
  public order_date!: Date;
  public status!: 'PENDING' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'CANCELLED';

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(): void {
    Order.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });
    Order.belongsTo(Share, { foreignKey: 'share_id' });
  }
}

const sequelizeConnection = SequelizeConnection.getInstance();

Order.init(
  {
    order_id: {
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
    order_type: {
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    remaining_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
  },
);

export default Order;