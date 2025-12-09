// pages/forum/index.js
import { useState } from "react";

export default function ForumPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");

  // ======== LOGIN =========
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return alert("Заполните все поля");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Вход выполнен: " + data.username);
        setLoginModalOpen(false);
      } else {
        alert(data.message || "Ошибка при входе");
      }
    } catch (err) {
      console.error(err);
      alert("Сервер недоступен");
    }
  };

  // ======== REGISTER =========
  const handleRegister = async () => {
    if (!regUsername || !regEmail || !regPassword || !regPassword2)
      return alert("Заполните все поля");
    if (regPassword !== regPassword2) return alert("Пароли не совпадают");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Регистрация успешна! Войдите в систему.");
        setRegisterModalOpen(false);
      } else {
        alert(data.message || "Ошибка при регистрации");
      }
    } catch (err) {
      console.error(err);
      alert("Сервер недоступен");
    }
  };

  return (
    <div style={{ background: "#e6f8f7", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* ======== TOP BAR ======== */}
      <div style={{
        width: "100%",
        padding: "15px 30px",
        background: "#4fd1c5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
          MED.UNIT — Форум
        </div>
        <div>
          <button onClick={() => setLoginModalOpen(true)} style={{ background: "white", color: "#1f7a73", border: "none", padding: "10px 18px", borderRadius: 12, marginLeft: 10, cursor: "pointer", fontWeight: "bold" }}>
            Вход
          </button>
          <button onClick={() => setRegisterModalOpen(true)} style={{ background: "white", color: "#1f7a73", border: "none", padding: "10px 18px", borderRadius: 12, marginLeft: 10, cursor: "pointer", fontWeight: "bold" }}>
            Регистрация
          </button>
        </div>
      </div>

      {/* ======== FORUM CONTENT ======== */}
      <div style={{
        width: "60%",
        margin: "40px auto",
        background: "rgba(255,255,255,0.5)",
        padding: 25,
        borderRadius: 20,
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
      }}>
        <div style={{ fontSize: 28, fontWeight: "bold", color: "#1f7a73", textAlign: "center", marginBottom: 20 }}>
          Темы форума
        </div>
        <p style={{ textAlign: "center", color: "#1e293b", fontSize: 18 }}>
          Здесь в будущем появятся темы, обсуждения и разделы.
        </p>
      </div>

      {/* ======== LOGIN MODAL ======== */}
      {loginModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 }}>
          <div style={{ width: 350, background: "white", padding: 25, borderRadius: 20, textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
            <h3 style={{ marginBottom: 15, color: "#1f7a73" }}>Вход</h3>
            <input type="text" placeholder="Логин" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ width: "90%", padding: 12, margin: 8, borderRadius: 10, border: "1px solid #4fd1c5", fontSize: 16 }} />
            <input type="password" placeholder="Пароль" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ width: "90%", padding: 12, margin: 8, borderRadius: 10, border: "1px solid #4fd1c5", fontSize: 16 }} />
            <button onClick={handleLogin} style={{ width: "95%", padding: 12, marginTop: 12, background: "#4fd1c5", border: "none", color: "white", fontSize: 18, borderRadius: 12, cursor: "pointer" }}>Войти</button>
            <div style={{ marginTop: 10, cursor: "pointer", fontSize: 14, color: "#1f7a73" }} onClick={() => setLoginModalOpen(false)}>Закрыть</div>
          </div>
        </div>
      )}

      {/* ======== REGISTER MODAL ======== */}
      {registerModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 }}>
          <div style={{ width: 350, background: "white", padding: 25, borderRadius: 20, textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
            <h3 style={{ marginBottom: 15, color: "#1f7a73" }}>Регистрация</h3>
            <input type="text" placeholder="Логин" value={regUsername} onChange={e => setRegUsername(e.target.value)} style={{ width: "90%", padding: 12, margin: 8, borderRadius: 10, border: "1px solid #4fd1c5", fontSize: 16 }} />
            <input type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={{ width: "90%", padding: 12, margin: 8, borderRadius: 10, border: "1px solid #4fd1c5", fontSize: 16 }} />
            <input type="password" placeholder="Пароль" value={regPassword} onChange={e => setRegPassword(e.target.value)} style={{ width: "90%", padding: 12, margin: 8, borderRadius: 10, border: "1px solid #4fd1c5", fontSize: 16 }} />
            <input type="password" placeholder="Повторите пароль" value={regPassword2} onChange={e => setRegPassword2(e.target.value)} style={{ width: "90%", padding: 12, margin: 8, borderRadius: 10, border: "1px solid #4fd1c5", fontSize: 16 }} />
            <button onClick={handleRegister} style={{ width: "95%", padding: 12, marginTop: 12, background: "#4fd1c5", border: "none", color: "white", fontSize: 18, borderRadius: 12, cursor: "pointer" }}>Создать аккаунт</button>
            <div style={{ marginTop: 10, cursor: "pointer", fontSize: 14, color: "#1f7a73" }} onClick={() => setRegisterModalOpen(false)}>Закрыть</div>
          </div>
        </div>
      )}
    </div>
  );
}
