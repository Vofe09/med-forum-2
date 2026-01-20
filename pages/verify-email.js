// pages/verify-email.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = router.query;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");

    if (!code) {
      setError("Введите код");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Ошибка подтверждения");
        return;
      }

      router.push("/login");
    } catch (e) {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Подтверждение email</h1>

      <p>
        Код отправлен на <b>{email}</b>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Код из письма"
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <button
        onClick={submit}
        disabled={loading}
        style={{ width: "100%", marginTop: 10 }}
      >
        {loading ? "Проверка..." : "Подтвердить"}
      </button>
    </div>
  );
}
