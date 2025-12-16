// pages/register.js
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Заполните все поля");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "register",
          username,
          email,
          password
        })
      });

      // ⛑ защита от пустого / не-JSON ответа
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data.message || "Ошибка сервера");
        setLoading(false);
        return;
      }

      // ✅ регистрация успешна → пользователь УЖЕ авторизован (sid)
      router.push("/profile");

    } catch (err) {
      console.error("REGISTER FETCH ERROR:", err);
      setError("Ошибка соединения с сервером");
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
          <h1>Регистрация</h1>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={submit}>
            <input
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

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

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать аккаунт"}
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
