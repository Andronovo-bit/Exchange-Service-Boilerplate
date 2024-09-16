// src/config/config.ts
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  SERVER_PORT: Joi.number().default(3000),
  DB_USER: Joi.string().required().label('Database Username'),
  DB_PASS: Joi.string().required().label('Database Password'),
  DB_NAME: Joi.string().required().label('Database Name'),
  DB_HOST: Joi.string().default('127.0.0.1'),
  DB_PORT: Joi.number().default(5432),
  DB_DIALECT: Joi.string().valid('postgres', 'mysql', 'mariadb', 'sqlite', 'mssql').default('postgres'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  server: {
    port: envVars.SERVER_PORT,
  },
  database: {
    username: envVars.DB_USER,
    password: envVars.DB_PASS,
    name: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    dialect: envVars.DB_DIALECT,
    logging: envVars.NODE_ENV === 'development' ? console.log : false,
  },
  api: {
    prefix: "/api",
  },
};

export default config;
