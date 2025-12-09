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

        const [result] = await pool.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashed]
        );

        res.status(200).json({ message: "Регистрация успешна" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Этот email уже используется" });
        }

        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
}
