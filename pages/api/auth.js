// pages/api/auth.js
import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type } = req.body;
  const conn = await pool.getConnection();

  try {
    /* ========= REGISTER ========= */
    if (type === "register") {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
      }

      // проверка уникальности
      const [exists] = await conn.query(
        "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
        [email, username]
      );

      if (exists.length) {
        return res.status(400).json({
          message: "Пользователь с таким email или логином уже существует"
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const [result] = await conn.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashed]
      );

      const userId = String(result.insertId);

      const sid = crypto.randomBytes(32).toString("hex");
      await conn.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, userId]
      );

      res.setHeader(
        "Set-Cookie",
        `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`
      );

      return res.status(200).json({ message: "Регистрация успешна" });
    }

    /* ========= LOGIN ========= */
    if (type === "login") {
      const { login, password } = req.body;
      // login = email ИЛИ username

      if (!login || !password) {
        return res.status(400).json({ message: "Введите логин и пароль" });
      }

      const [rows] = await conn.query(
        `
        SELECT id, password
        FROM users
        WHERE email = ? OR username = ?
        LIMIT 1
        `,
        [login, login]
      );

      if (!rows.length) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password);

      if (!ok) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const userId = String(user.id);
      const sid = crypto.randomBytes(32).toString("hex");

      await conn.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, userId]
      );

      res.setHeader(
        "Set-Cookie",
        `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`
      );

      return res.status(200).json({ message: "Вход выполнен" });
    }

    return res.status(400).json({ message: "Неизвестный тип запроса" });
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(500).json({
      message: "Ошибка сервера",
      error: err.message
    });
  } finally {
    conn.release();
  }
}
