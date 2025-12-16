import pool from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Метод не разрешён" });
    }

    const { type } = req.body;

    try {
        // ===== РЕГИСТРАЦИЯ =====
        if (type === "register") {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ message: "Заполните все поля" });
            }

            const hashed = await bcrypt.hash(password, 10);

            await pool.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hashed]
            );

            // 🔥 получаем РЕАЛЬНЫЙ id
            const [rows] = await pool.query(
                "SELECT id, username, email FROM users WHERE email = ? LIMIT 1",
                [email]
            );

            const user = rows[0];

            return res.status(200).json({
                message: "Регистрация успешна",
                user: {
                    id: user.id.toString(),   // ✅ string
                    username: user.username,
                    email: user.email
                }
            });
        }

        // ===== ЛОГИН =====
        if (type === "login") {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Введите email и пароль" });
            }

            const [rows] = await pool.query(
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

            return res.status(200).json({
                message: "Вход выполнен",
                user: {
                    id: user.id.toString(),   // ✅ string
                    username: user.username,
                    email: user.email
                }
            });
        }

        return res.status(400).json({ message: "Неизвестный тип запроса" });

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Этот email уже используется" });
        }

        console.error("AUTH ERROR:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
}
