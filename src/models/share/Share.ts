import { Model, DataTypes, Optional } from 'sequelize';
import { SequelizeConnection } from '../../database';

// Define the attributes for the Share model
interface ShareAttributes {
  share_id: number;
  symbol: string;
  name: string;
  latest_price: number;
}

// Define the creation attributes for the Share model
type ShareCreationAttributes = Optional<ShareAttributes, 'share_id'>;

const sequelizeConnection = SequelizeConnection.getInstance();

// Define the Share model class
class Share extends Model<ShareAttributes, ShareCreationAttributes> implements ShareAttributes {
  public share_id!: number;
  public symbol!: string;
  public name!: string;
  public latest_price!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    sequelize: sequelizeConnection,
    tableName: 'shares',
    timestamps: true, // Enable timestamps
  },
);

export default Share;
