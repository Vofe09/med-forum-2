// pages/api/me.js
import pool from "../../lib/db";
import cookie from "cookie";
export const config = {
  runtime: "nodejs"
};


export default async function handler(req, res) {
  // 🚫 ВАЖНО: API с авторизацией НЕЛЬЗЯ кэшировать (Vercel / CDN)
  res.removeHeader("ETag");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 🔐 корректно парсим cookie
  const { sid } = cookie.parse(req.headers.cookie || "");

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
        u.reputation,
        u.tests_passed,
        u.study_year,
        u.direction,
        u.avatar
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

    // ✅ всегда 200 с телом
    return res.status(200).json(rows[0]);

  } catch (err) {
    console.error("ME API ERROR:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
}
