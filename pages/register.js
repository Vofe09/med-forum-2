import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "register",
                username,
                email,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message);
            return;
        }

        setSuccess("Регистрация успешна");
        setTimeout(() => {
            router.push("/login");
        }, 1000);
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Регистрация</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={submit}>
                <input
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br /><br />
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br /><br />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}
