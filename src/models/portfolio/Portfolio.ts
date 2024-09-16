import { Model, DataTypes, Optional } from 'sequelize';
import { SequelizeConnection } from '../../database';
import User from '../user/User';
import Trade from '../trade/Trade';
import PortfolioHoldings from './PortfolioHoldings';

// Define the attributes for the Portfolio model
interface PortfolioAttributes {
  portfolio_id: number;
  user_id: number;
}

// Define the creation attributes for the Portfolio model
type PortfolioCreationAttributes = Optional<PortfolioAttributes, 'portfolio_id'>;

// Define the Portfolio model class
class Portfolio extends Model<PortfolioAttributes, PortfolioCreationAttributes> implements PortfolioAttributes {
  public portfolio_id!: number;
  public user_id!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(): void {
    Portfolio.belongsTo(User, { foreignKey: 'user_id' });
    Portfolio.hasMany(Trade, { foreignKey: 'portfolio_id' });
    Portfolio.hasMany(PortfolioHoldings, { foreignKey: 'portfolio_id' });
  }
}

const sequelizeConnection = SequelizeConnection.getInstance();

// Initialize the Portfolio model
Portfolio.init(
  {
    portfolio_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id', // Ensure this matches the User model's primary key
      },
      unique: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'portfolios',
    timestamps: true, // Enable timestamps
  },
);

export default Portfolio;