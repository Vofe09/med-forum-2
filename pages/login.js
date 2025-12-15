import Head from "next/head";
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
        <>
            <Head>
                <link rel="stylesheet" href="/css/auth.css" />
            </Head>

            <div className="auth-page">
                <div className="auth-card">
                    <h1>Вход</h1>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={submit}>
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
                            Войти
                        </button>
                    </form>

                    <div className="auth-footer">
                        Нет аккаунта? <a href="/register">Регистрация</a>
                    </div>
                </div>
            </div>
        </>
    );
}
