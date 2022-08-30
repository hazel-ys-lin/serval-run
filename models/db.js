require('dotenv').config();
const mysql = require('mysql2');

//create connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
  database: 'servalrun',
  namedPlaceholders: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
