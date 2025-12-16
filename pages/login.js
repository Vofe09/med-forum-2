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
          email,
          password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Ошибка входа");
        setLoading(false);
        return;
      }

      // Проверим /api/me чтобы убедиться, что cookie/sid применился
      try {
        const meRes = await fetch("/api/me", { credentials: "include" });
        if (!meRes.ok) {
          // сессия не установлена — показать ошибку
          const errBody = await meRes.json().catch(() => ({}));
          setError(errBody.error || "Не удалось подтвердить сессию");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("ME CHECK ERROR:", err);
        setError("Ошибка проверки сессии");
        setLoading(false);
        return;
      }

      // Всё ок — редиректим
      router.push("/profile");

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Ошибка сервера");
    } finally {
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
