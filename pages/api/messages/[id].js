// pages/api/messages/[id].js
import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { id: subtopicId } = req.query;

  // ===== GET =====
  if (req.method === "GET") {
    const [rows] = await pool.query(
      `SELECT m.id, m.text, m.created_at, u.username AS user
       FROM messages m
       JOIN users u ON u.id = m.user_id
       WHERE m.subtopic_id = ?
       ORDER BY m.created_at ASC`,
      [subtopicId]
    );

    return res.status(200).json(rows);
  }

  // ===== POST =====
  if (req.method === "POST") {
    // 🔒 проверка авторизации
    const cookie = req.headers.cookie
      ?.split("; ")
      .find(c => c.startsWith("user="));

    if (!cookie) {
      return res.status(401).json({ error: "Необходимо войти в аккаунт" });
    }

    let user;
    try {
      user = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
    } catch {
      return res.status(401).json({ error: "Неверная сессия" });
    }

    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "Пустое сообщение" });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1️⃣ записываем сообщение
      await conn.query(
        "INSERT INTO messages (subtopic_id, user_id, text) VALUES (?, ?, ?)",
        [subtopicId, user.id, text]
      );

      // 2️⃣ обновляем счётчики
      await conn.query(
        `UPDATE users
         SET posts_count = posts_count + 1,
             reputation = reputation + 10
         WHERE id = ?`,
        [user.id]
      );

      await conn.commit();
      res.status(201).json({ success: true });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({ error: "Ошибка сервера" });
      
    } finally {
      conn.release();
    }
  }
}
