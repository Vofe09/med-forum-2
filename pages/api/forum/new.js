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
      host: process.env.TIDB_HOST,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: "test",
      ssl: { rejectUnauthorized: true }
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
    console.log(err);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}
