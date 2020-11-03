const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DBNAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.PROD_DATABASE_USERNAME,
    password: process.env.PROD_DATABASE_PASSWORD,
    database: process.env.PROD_DATABASE_DBNAME,
    host: process.env.PROD_DATABASE_HOST,
    dialect: 'postgres',
    logging: false,
  },
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT
};
