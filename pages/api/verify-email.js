// pages/api/verify-email.js

export const config = {
  runtime: "nodejs"
};

import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email и код обязательны" });
  }

  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(
      `
      SELECT 
        ev.user_id,
        ev.expires_at
      FROM email_verifications ev
      JOIN users u ON u.id = ev.user_id
      WHERE u.email = ? AND ev.code = ?
      LIMIT 1
      `,
      [email, code]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Неверный код" });
    }

    if (new Date(rows[0].expires_at) < new Date()) {
      return res.status(400).json({ message: "Код истёк" });
    }

    const userId = rows[0].user_id;

    await conn.query(
      "UPDATE users SET email_verified = 1 WHERE id = ?",
      [userId]
    );

    await conn.query(
      "DELETE FROM email_verifications WHERE user_id = ?",
      [userId]
    );

    return res.status(200).json({ message: "Email подтверждён" });

  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    return res.status(500).json({ message: "Ошибка сервера" });
  } finally {
    conn.release();
  }
}
