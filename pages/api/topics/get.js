import mysql from "mysql2/promise";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.execute("SELECT * FROM topics WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}
