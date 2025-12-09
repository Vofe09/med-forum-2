import mysql from "mysql2/promise";

let pool;

if (!pool) {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: true
        }
    });
}

export default pool;
// 