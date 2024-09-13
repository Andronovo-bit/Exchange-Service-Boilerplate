import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // install dotenv

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    dialect: 'postgres', // 'mysql' | 'mariadb' | 'postgres' | 'mssql' - it is database provider you are using
    ssl: false,
  },
  
);

export default sequelize;
