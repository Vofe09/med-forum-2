// pages/api/auth.js
import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Метод не разрешён" });
  }

  const { type } = req.body;

  try {
    /* =========================
       РЕГИСТРАЦИЯ
       ========================= */
    if (type === "register") {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
      }

      const hashed = await bcrypt.hash(password, 10);

      // создаём пользователя
      await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashed]
      );

      // получаем РЕАЛЬНЫЙ id (НЕ ОТДАЁМ ФРОНТУ)
      const [rows] = await pool.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      if (!rows.length) {
        return res.status(500).json({ message: "Не удалось создать пользователя" });
      }

      const userId = rows[0].id;

      // создаём сессию
      const sid = generateSessionId();

      await pool.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, userId]
      );

      // HttpOnly cookie
      res.setHeader("Set-Cookie", [
        `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`
      ]);

      return res.status(200).json({
        message: "Регистрация успешна"
      });
    }

    /* =========================
       ЛОГИН
       ========================= */
    if (type === "login") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Введите email и пароль" });
      }

      const [rows] = await pool.query(
        "SELECT id, password FROM users WHERE email = ? LIMIT 1",
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

      // новая сессия
      const sid = generateSessionId();

      await pool.query(
        "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
        [sid, user.id]
      );

      res.setHeader("Set-Cookie", [
        `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`
      ]);

      return res.status(200).json({
        message: "Вход выполнен"
      });
    }

    return res.status(400).json({ message: "Неизвестный тип запроса" });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Этот email уже используется" });
    }

    console.error("AUTH ERROR:", err);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}
