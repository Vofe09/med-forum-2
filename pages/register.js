import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState("");
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

        router.push("/login");
    };

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/css/auth.css" />
            </Head>

            <div className="auth-page">
                <div className="auth-card">
                    <h1>Регистрация</h1>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={submit}>
                        <input
                            placeholder="Логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit" className="auth-button">
                            Создать аккаунт
                        </button>
                    </form>

                    <div className="auth-footer">
                        Уже есть аккаунт? <a href="/login">Войти</a>
                    </div>
                </div>
            </div>
        </>
    );
}
