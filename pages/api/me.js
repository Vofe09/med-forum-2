// pages/api/me.js
import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 🔐 читаем sid из cookie
  const sid = req.headers.cookie
    ?.split("; ")
    .find(c => c.startsWith("sid="))
    ?.split("=")[1];

  if (!sid) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.posts_count,
        u.reputation
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
      LIMIT 1
      `,
      [sid]
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Сессия не найдена" });
    }

    return res.status(200).json(rows[0]);

  } catch (err) {
    console.error("ME API ERROR:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
}
