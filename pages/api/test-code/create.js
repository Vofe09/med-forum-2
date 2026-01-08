import pool from "../../../lib/db";

export default async function handler(req, res) {
  // 🔐 CORS
  res.setHeader("Access-Control-Allow-Origin", "https://unit-med.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
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
  } catch (err) {
    console.error("CREATE TEST CODE ERROR:", err);
    return res.status(500).json({ error: "DB error" });
  }
}
