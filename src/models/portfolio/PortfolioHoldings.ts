import { Model, DataTypes, Optional } from 'sequelize';
import { SequelizeConnection } from '../../database';
import Portfolio from './Portfolio';
import Share from '../share/Share';

// Define the attributes for the PortfolioHoldings model
interface PortfolioHoldingsAttributes {
  portfolio_id: number;
  share_id: number;
  quantity: number;
  average_price: number;
  total_value: number;
}

// Define the creation attributes for the PortfolioHoldings model
type PortfolioHoldingsCreationAttributes = Optional<
  PortfolioHoldingsAttributes,
  'quantity' | 'average_price' | 'total_value'
>;

// Define the PortfolioHoldings model class
class PortfolioHoldings
  extends Model<PortfolioHoldingsAttributes, PortfolioHoldingsCreationAttributes>
  implements PortfolioHoldingsAttributes
{
  public portfolio_id!: number;
  public share_id!: number;
  public quantity!: number;
  public average_price!: number;
  public total_value!: number;

  // Timestamps (automatically managed by Sequelize)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(): void {
    // Define associations here if needed
    PortfolioHoldings.belongsTo(Portfolio, { foreignKey: 'portfolio_id' });
    PortfolioHoldings.belongsTo(Share, { foreignKey: 'share_id' });
  }
}
const sequelizeConnection = SequelizeConnection.getInstance();

// Initialize the PortfolioHoldings model
PortfolioHoldings.init(
  {
    portfolio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Portfolio,
        key: 'portfolio_id',
      },
    },
    share_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
      type: DataTypes.DECIMAL(15, 6),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    total_value: {
      type: DataTypes.VIRTUAL(DataTypes.DECIMAL(20, 6), ['quantity', 'average_price']),
      get() {
        return this.getDataValue('quantity') * this.getDataValue('average_price');
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: 'portfolio_holdings',
    timestamps: true, // Enable automatic timestamps
    indexes: [
      {
        unique: false,
        fields: ['portfolio_id'],
      },
      {
        unique: false,
        fields: ['share_id'],
      },
      {
        unique: true,
        fields: ['portfolio_id', 'share_id'],
      },
    ],
  },
);

// Export the model
export default PortfolioHoldings;


