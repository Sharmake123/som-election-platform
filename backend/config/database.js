const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'som_election',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1', // Force IPv4
    dialect: 'mysql',
    logging: false,
    port: process.env.DB_PORT || 3306,
  }
);

module.exports = sequelize;
