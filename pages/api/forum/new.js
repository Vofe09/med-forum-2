import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: Number(process.env.DB_PORT), // ← очень важно для TiDB
      database: process.env.DB_NAME,
      ssl: {
        minVersion: "TLSv1.2"
      }
    });

    const [result] = await db.execute(
      "INSERT INTO threads (title, content, author_id) VALUES (?, ?, ?)",
      [title, content, authorId]
    );

    await db.end();

    return res.status(200).json({
      success: true,
      threadId: result.insertId
    });

  } catch (err) {
    console.error("TiDB ERROR:", err);
    return res.status(500).json({
      message: "Ошибка сервера",
      error: err.message
    });
  }
}
