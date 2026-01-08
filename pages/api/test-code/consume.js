import pool from "../../../lib/db";
import cookie from "cookie";

export default async function handler(req, res) {
  console.log("=== CONSUME START ===");

  if (req.method !== "POST") {
    console.log("Wrong method:", req.method);
    return res.status(405).end();
  }

  const cookies = cookie.parse(req.headers.cookie || "");
  const sid = cookies.sid;

  console.log("SID FROM COOKIE:", sid);

  if (!sid) {
    console.log("NO SID");
    return res.status(401).json({ error: "No SID" });
  }

  const { code } = req.body || {};
  console.log("CODE FROM BODY:", code);

  if (!code) {
    console.log("NO CODE IN BODY");
    return res.status(400).json({ error: "No code" });
  }

  let conn;

  try {
    conn = await pool.getConnection();
    console.log("DB CONNECTION OK");

    await conn.beginTransaction();
    console.log("TRANSACTION STARTED");

    // 1️⃣ ищем пользователя по сессии
    const [userRows] = await conn.query(
      `
      SELECT u.id
      FROM users u
      JOIN sessions s ON s.user_id = u.id
      WHERE s.id = ?
      `,
      [sid]
    );

    console.log("USER ROWS:", userRows);

    if (!userRows.length) {
      console.log("USER NOT FOUND FOR SID:", sid);
      await conn.rollback();
      return res.status(401).json({ error: "User not found by session" });
    }

    const userId = userRows[0].id;
    console.log("USER ID:", userId);

    // 2️⃣ проверяем код
    const [codeRows] = await conn.query(
      "SELECT * FROM test_codes WHERE code = ? FOR UPDATE",
      [code]
    );

    console.log("CODE ROWS:", codeRows);

    if (codeRows.length && codeRows[0].used_at) {
      console.log("CODE ALREADY USED");
      await conn.rollback();
      return res.status(409).json({ error: "Code already used" });
    }

    // 3️⃣ если кода нет — создаём
    if (!codeRows.length) {
      console.log("CODE NOT FOUND, INSERTING");
      await conn.query(
        "INSERT INTO test_codes (code) VALUES (?)",
        [code]
      );
    }

    // 4️⃣ начисляем тест
    console.log("UPDATING tests_passed FOR USER:", userId);
    const [updateResult] = await conn.query(
      "UPDATE users SET tests_passed = tests_passed + 1 WHERE id = ?",
      [userId]
    );

    console.log("UPDATE RESULT:", updateResult);

    // 5️⃣ помечаем код использованным
    console.log("MARKING CODE AS USED");
    await conn.query(
      `
      UPDATE test_codes
      SET used_at = NOW(), used_by = ?
      WHERE code = ?
      `,
      [userId, code]
    );

    await conn.commit();
    console.log("TRANSACTION COMMITTED");
    console.log("=== CONSUME SUCCESS ===");

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("CONSUME ERROR:", err);

    if (conn) {
      await conn.rollback();
      console.log("TRANSACTION ROLLED BACK");
    }

    return res.status(500).json({ error: "Internal error" });

  } finally {
    if (conn) {
      conn.release();
      console.log("CONNECTION RELEASED");
    }
  }
}
