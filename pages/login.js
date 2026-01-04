// pages/login.js
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: "login",
          login: email,
          password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Ошибка входа");
        setLoading(false);
        return;
      }

      // ✅ ВАЖНО:
      // не дергаем /api/me здесь
      // делаем жёсткий редирект, чтобы браузер гарантированно применил cookie
      window.location.href = "/profile";

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Ошибка сервера");
      setLoading(false);
    }
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
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
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
