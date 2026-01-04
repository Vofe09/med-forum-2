// pages/api/logout.js
import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const sid = req.headers.cookie
    ?.split("; ")
    .find(c => c.startsWith("sid="))
    ?.split("=")[1];

  if (sid) {
    try {
      await pool.query("DELETE FROM sessions WHERE id = ?", [sid]);
    } catch (err) {
      console.error("LOGOUT DB ERROR:", err);
      // не прерываем — всё равно почистим cookie
    }
  }

  // очистить cookie (HttpOnly)
  res.setHeader("Set-Cookie", `sid=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
  return res.status(200).json({ ok: true });
}
