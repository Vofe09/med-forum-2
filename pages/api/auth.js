// pages/api/auth.js

export const config = {
  runtime: "nodejs"
};

import pool from "../../lib/db";
import { sendVerificationEmail } from "../../lib/mail";
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
    /* ================= REGISTER ================= */
    if (type === "register") {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
      }

      // Проверка уникальности
      const [exists] = await conn.query(
        "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
        [email, username]
      );

      if (exists.length) {
        return res.status(400).json({
          message: "Пользователь с таким email или логином уже существует"
        });
      }

      // Хеш пароля
      const hashed = await bcrypt.hash(password, 10);

      // Создание пользователя
      const [result] = await conn.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashed]
      );

      const userId = result.insertId;

      // Генерация кода подтверждения
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      // Сохранение кода
      await conn.query(
        `
        INSERT INTO email_verifications (user_id, code, expires_at)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE code = ?, expires_at = ?
        `,
        [userId, code, expires, code, expires]
      );

      // Отправка email
      await sendVerificationEmail(email, code);

      // ❌ НЕ создаём сессию
      return res.status(200).json({
        message: "Код подтверждения отправлен",
        needVerify: true
      });
    }

    /* ================= LOGIN ================= */
    if (type === "login") {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({ message: "Введите логин и пароль" });
      }

      const [rows] = await conn.query(
        `
        SELECT id, password, email_verified
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

      if (!user.email_verified) {
        return res.status(403).json({
          message: "Подтвердите email"
        });
      }

      // Создание сессии
      const sid = crypto.randomBytes(32).toString("hex");

      await conn.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, user.id]
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
