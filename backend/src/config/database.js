require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER || 'dev_user',
    password: process.env.DB_PASSWORD || 'dev123',
    database: process.env.DB_NAME || 'todo_app',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'dev_user',
    password: process.env.DB_PASSWORD || 'dev123',
    database: process.env.DB_NAME || 'todo_app',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

console.log('📊 Database Configuration:', {
  database: config.development.database,
  host: config.development.host,
  username: config.development.username
});

module.exports = config;