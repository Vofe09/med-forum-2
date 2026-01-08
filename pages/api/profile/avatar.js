// pages/api/profile/avatar.js
import pool from "../../../lib/db";
import cookie from "cookie";

function isValidImageUrl(url) {
  try {
    const u = new URL(url);

    // только http / https
    if (!["http:", "https:"].includes(u.protocol)) return false;

    // защита от javascript:, data:, file:
    if (url.startsWith("javascript:")) return false;
    if (url.startsWith("data:")) return false;

    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { sid } = cookie.parse(req.headers.cookie || "");
  if (!sid) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { avatarUrl } = req.body;

  if (!avatarUrl || typeof avatarUrl !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!isValidImageUrl(avatarUrl)) {
    return res.status(400).json({
      error: "Некорректная ссылка на изображение",
    });
  }

  try {
    await pool.query(
      `
      UPDATE users u
      JOIN sessions s ON s.user_id = u.id
      SET u.avatar = ?
      WHERE s.id = ?
      `,
      [avatarUrl.trim(), sid]
    );

    return res.status(200).json({ avatar: avatarUrl.trim() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "DB error" });
  }
}
