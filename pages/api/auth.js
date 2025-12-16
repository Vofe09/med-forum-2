// pages/api/auth.js
import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export default async function handler(req, res) {
  // ✅ CORS / preflight (ОБЯЗАТЕЛЬНО для Vercel)
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(200).end();
  }

  // ❗ НЕ РОНЯЕМ GET ЖЁСТКО
  if (req.method !== "POST") {
    return res.status(200).json({ ok: false });
  }

  const { type } = req.body;

  const conn = await pool.getConnection();

  try {
    /* =====================
       REGISTRATION
    ===================== */
    if (type === "register") {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
      }

      const hashed = await bcrypt.hash(password, 10);

      await conn.beginTransaction();

      // 1️⃣ создаём пользователя
      const [result] = await conn.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashed]
      );

      // 2️⃣ получаем РЕАЛЬНЫЙ id (TiDB AUTO_RANDOM)
      const [rows] = await conn.query(
        "SELECT id, username, email FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      if (!rows.length) {
        throw new Error("User not found after insert");
      }

      const user = rows[0];

      // 3️⃣ создаём session
      const sid = crypto.randomBytes(32).toString("hex");

      await conn.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, user.id]
      );

      await conn.commit();

      // 4️⃣ ставим cookie
      res.setHeader(
        "Set-Cookie",
        `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`
      );

      return res.status(200).json({
        message: "Регистрация успешна"
      });
    }

    /* =====================
       LOGIN
    ===================== */
    if (type === "login") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Введите email и пароль" });
      }

      const [rows] = await conn.query(
        "SELECT id, username, email, password FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      if (!rows.length) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const user = rows[0];
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const sid = crypto.randomBytes(32).toString("hex");

      await conn.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, user.id]
      );

      res.setHeader(
        "Set-Cookie",
        `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`
      );

      return res.status(200).json({
        message: "Вход выполнен"
      });
    }

    return res.status(400).json({ message: "Неизвестный тип запроса" });

  } catch (err) {
    await conn.rollback();
    console.error("AUTH ERROR FULL:", err);
    return res.status(500).json({
      message: "Ошибка сервера",
      error: err.message,
      code: err.code
    });
  } finally {
    conn.release();
  }
}
