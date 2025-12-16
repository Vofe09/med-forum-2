import pool from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Метод не разрешён" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Введите email и пароль" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT id, username, email, password FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const user = rows[0];

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        // 🔥 ВАЖНО: id → string
        res.status(200).json({
            message: "Вход выполнен",
            user: {
                id: user.id.toString(),
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
}
