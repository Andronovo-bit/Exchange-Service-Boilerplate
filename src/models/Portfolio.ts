import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db/database';
import User from './User';

// Define the attributes for the Portfolio model
interface PortfolioAttributes {
  portfolio_id: number;
  user_id: number;
}

// Define the creation attributes for the Portfolio model
type PortfolioCreationAttributes = Optional<PortfolioAttributes, 'portfolio_id'>

// Define the Portfolio model class
class Portfolio extends Model<PortfolioAttributes, PortfolioCreationAttributes> implements PortfolioAttributes {
  public portfolio_id!: number;
  public user_id!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
        key: 'id', // Corrected the key to match the User model's primary key
      },
      unique: true,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'portfolios',
    timestamps: true, // Enable timestamps
  },
);

export default Portfolio;