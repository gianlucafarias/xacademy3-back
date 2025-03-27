const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'xacademydb',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'xacademydb',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'xacademydb',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  }
};
