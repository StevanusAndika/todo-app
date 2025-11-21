import { Sequelize } from 'sequelize-typescript';
import { Category } from './Category';
import { Todo } from './Todo';

// Import database config
const databaseConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

// Jika environment test, gunakan development config
const finalConfig = config || databaseConfig.development;

console.log('🔧 Database Config:', {
  environment: env,
  database: finalConfig.database,
  host: finalConfig.host
});

const sequelize = new Sequelize({
  database: finalConfig.database,
  username: finalConfig.username,
  password: finalConfig.password,
  host: finalConfig.host,
  port: finalConfig.port,
  dialect: finalConfig.dialect,
  models: [Category, Todo],
  logging: finalConfig.logging,
  pool: finalConfig.pool
});

export { sequelize, Category, Todo };