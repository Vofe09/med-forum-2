import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME, // <- тут должно быть имя твоей базы
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: true
  }
});

export default db;
