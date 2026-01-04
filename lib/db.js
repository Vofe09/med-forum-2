import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  // 🔴 КРИТИЧНО ДЛЯ TiDB + BIGINT
  supportBigNumbers: true,
  bigNumberStrings: true,

  ssl: {
    rejectUnauthorized: true
  },

  // optional, но полезно
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
