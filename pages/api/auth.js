// pages/api/auth.js
import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export default async function handler(req, res) {
  // CORS / preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(200).end();
  }
  if (req.method !== "POST") return res.status(200).json({ ok: false });

  const { type } = req.body;
  const conn = await pool.getConnection();

  try {
    /* ========= REGISTER ========= */
    if (type === "register") {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
      }

      const hashed = await bcrypt.hash(password, 10);

      // вставляем пользователя
      await conn.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashed]
      );

      // получаем реальный id через SELECT
      const [rows] = await conn.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
      );
      if (!rows.length) throw new Error("User not found after insert");

      // ВАЖНО: приводим к строке, чтобы не потерять точность
      const userId = String(rows[0].id);
      console.log("REGISTER: userId (string) =", userId);

      // создаём сессию — передаём строку
      const sid = crypto.randomBytes(32).toString("hex");
      await conn.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, userId]
      );

      res.setHeader("Set-Cookie", `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`);
      return res.status(200).json({ message: "Регистрация успешна" });
    }

    /* ========= LOGIN ========= */
    if (type === "login") {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Введите email и пароль" });
      }

      const [rows] = await conn.query(
        "SELECT id, password FROM users WHERE email = ? LIMIT 1",
        [email]
      );
      if (!rows.length) return res.status(400).json({ message: "Пользователь не найден" });

      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: "Неверный пароль" });

      const userId = String(user.id);
      console.log("LOGIN: userId (string) =", userId);

      const sid = crypto.randomBytes(32).toString("hex");
      await conn.query("INSERT INTO sessions (id, user_id) VALUES (?, ?)", [sid, userId]);

      res.setHeader("Set-Cookie", `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`);
      return res.status(200).json({ message: "Вход выполнен" });
    }

    return res.status(400).json({ message: "Неизвестный тип запроса" });
  } catch (err) {
    console.error("AUTH ERROR FULL:", err);
    return res.status(500).json({
      message: "Ошибка сервера",
      error: err.message
    });
  } finally {
    conn.release();
  }
}
