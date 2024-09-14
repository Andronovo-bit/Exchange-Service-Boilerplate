import { Dialect, Options } from 'sequelize';

interface IDatabaseConfig {
  [key: string]: Options;
}

// Define your database configurations for different environments
const config: IDatabaseConfig = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'my_database_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432, // Adjust as needed
    dialect: 'postgres' as Dialect, // Change dialect if needed (e.g., mysql, mariadb)
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'my_database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres' as Dialect,
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'my_database_prod',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres' as Dialect,
    logging: false, // Disable logging in production
  },
};

export default config;
