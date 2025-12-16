import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");

    if (!username || !email || !password) {
      setError("Заполните все поля");
      return;
    }

    setLoading(true);

    try {
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Ошибка сервера");
        setLoading(false);
        return;
      }

      router.push("/profile");
    } catch (e) {
      console.error(e);
      setError("Ошибка соединения");
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

          {/* ❌ БЕЗ onSubmit */}
          <div className="auth-form">
            <input
              placeholder="Логин"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {/* ❗ type="button" */}
            <button
              type="button"
              className="auth-button"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать аккаунт"}
            </button>
          </div>

          <div className="auth-footer">
            Уже есть аккаунт? <a href="/login">Войти</a>
          </div>
        </div>
      </div>
    </>
  );
}
