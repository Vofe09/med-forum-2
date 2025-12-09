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
            "SELECT * FROM users WHERE email = ?",
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

        res.status(200).json({
            message: "Вход выполнен",
            username: user.username,
            id: user.id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
}
