const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DEV_DB_NAME,
  process.env.DEV_DB_USER,
  process.env.DEV_DB_PASSWORD,
  {
    host: process.env.DEV_DB_HOST,
    dialect: 'mysql',
    // pool: {
    //   max: process.env.POOL_MAX,
    //   min: process.env.POOL_MIN,
    //   acquire: process.env.POOL_ACQUIRE,
    //   idle: process.env.POOL_IDLE,
    // },
  },
);

module.exports = sequelize;
