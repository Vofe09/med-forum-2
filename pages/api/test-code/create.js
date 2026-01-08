import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { code } = req.body;

  if (!code || code.length !== 20) {
    return res.status(400).json({ error: "Invalid code" });
  }

  try {
    await pool.query(
      "INSERT IGNORE INTO test_codes (code) VALUES (?)",
      [code]
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "DB error" });
  }
}
