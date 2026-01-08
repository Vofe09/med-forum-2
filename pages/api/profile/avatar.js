// pages/api/profile/avatar.js
import pool from "../../../lib/db";
import cookie from "cookie";

const ALLOWED_HOSTS = [
  "googleusercontent.com",
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "i.imgur.com",
  "images.unsplash.com",
];

function isValidImageUrl(url) {
  try {
    const u = new URL(url);

    if (!["http:", "https:"].includes(u.protocol)) return false;

    return ALLOWED_HOSTS.some((host) =>
      u.hostname.endsWith(host)
    );
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
      error: "Ссылка недопустима. Используй прямую ссылку на изображение",
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
      [avatarUrl, sid]
    );

    return res.status(200).json({ avatar: avatarUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "DB error" });
  }
}
