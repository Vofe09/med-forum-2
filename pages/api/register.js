import pool from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Метод не разрешён" });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);

        // 1️⃣ создаём пользователя
        await pool.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashed]
        );

        // 2️⃣ СРАЗУ получаем реальный id из БД (важно для TiDB AUTO_RANDOM)
        const [rows] = await pool.query(
            "SELECT id, username, email FROM users WHERE email = ?",
            [email]
        );

        if (!rows.length) {
            return res.status(500).json({ message: "Не удалось создать пользователя" });
        }

        const user = rows[0];

        // 3️⃣ возвращаем реальные данные пользователя
        res.status(200).json({
            message: "Регистрация успешна",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Этот email уже используется" });
        }

        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
}
