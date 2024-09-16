// src/models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { SequelizeConnection } from '../../config/database/sequelizeInstance'; // Updated import
import Portfolio from '../portfolio/Portfolio';
import Transaction from '../transaction/Transaction';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  balance: number;
}

// Define the creation attributes for the User model
type UserCreationAttributes = Optional<UserAttributes, 'id'>;

const sequelizeConnection = SequelizeConnection.getInstance();

// Define the User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public balance!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(): void {
    // Define associations here if needed
    User.hasOne(Portfolio, { foreignKey: 'user_id' });
    User.hasMany(Transaction, { foreignKey: 'user_id' });
  }
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(127),
      allowNull: false,
      validate: {
        isAlphanumeric: true,
        len: [3, 127],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255],
      },
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize: sequelizeConnection, // Directly use the imported sequelize instance
    tableName: 'users',
    timestamps: true, // Enable timestamps
  },
);

export default User;
