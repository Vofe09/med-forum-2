// pages/api/profile/update.js
import pool from "../../../lib/db";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { sid } = cookie.parse(req.headers.cookie || "");
  if (!sid) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { study_year, direction } = req.body;

  try {
    const [[session]] = await pool.query(
      "SELECT user_id FROM sessions WHERE id = ? LIMIT 1",
      [sid]
    );

    if (!session) {
      return res.status(401).json({ error: "Session not found" });
    }

    await pool.query(
      `
      UPDATE users
      SET study_year = ?, direction = ?
      WHERE id = ?
      `,
      [study_year, direction, session.user_id]
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}
