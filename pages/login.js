import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "login",
                email,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message);
            return;
        }

        document.cookie = `user=${encodeURIComponent(
            JSON.stringify(data.user)
        )}; path=/`;

        router.push("/profile");
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Вход</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={submit}>
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
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}
