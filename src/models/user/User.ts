// src/models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import {SequelizeConnection} from '../../config/database/sequelizeInstance'; // Updated import

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
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

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection, // Directly use the imported sequelize instance
    tableName: 'users',
    timestamps: true, // Enable timestamps
  },
);

export default User;
