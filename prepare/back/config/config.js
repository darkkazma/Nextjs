const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": "darkkazma",
    "password": process.env.DB_PASSWORD,
    "database": "nodebird",
    "host": "192.168.110.79",
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  }
}
