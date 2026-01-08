import pool from "../../../lib/db";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { sid } = cookie.parse(req.headers.cookie || "");
  if (!sid) return res.status(401).end();

  const { code } = req.body;
  if (!code) return res.status(400).end();

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [[row]] = await conn.query(
      "SELECT * FROM test_codes WHERE code = ? FOR UPDATE",
      [code]
    );

    if (!row || row.used_at) {
      await conn.rollback();
      return res.status(409).json({ error: "Code already used" });
    }

    const [[user]] = await conn.query(
      `
      SELECT u.id
      FROM users u
      JOIN sessions s ON s.user_id = u.id
      WHERE s.id = ?
      `,
      [sid]
    );

    await conn.query(
      "UPDATE users SET tests_passed = tests_passed + 1 WHERE id = ?",
      [user.id]
    );

    await conn.query(
      `
      UPDATE test_codes
      SET used_at = NOW(), used_by = ?
      WHERE code = ?
      `,
      [user.id, code]
    );

    await conn.commit();
    return res.status(200).json({ ok: true });

  } catch (e) {
    await conn.rollback();
    return res.status(500).json({ error: "DB error" });
  } finally {
    conn.release();
  }
}
