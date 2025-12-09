// pages/forum/new.js
import { useState } from "react";

export default function NewThreadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async () => {
    if (!title || !content || !author) {
      return alert("Заполните все поля");
    }

    try {
      const res = await fetch("/api/forum/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text: content, author }), // <-- FIX
      });

      const data = await res.json();

      if (res.ok) {
        alert("Тема создана!");
        window.location.href = `/forum/${data.threadId}`;
      } else {
        alert(data.message || "Ошибка создания темы");
      }
    } catch (err) {
      console.log(err);
      alert("Сервер недоступен");
    }
  };


  return (
    <div style={{
      background: "#e6f8f7",
      minHeight: "100vh",
      padding: 30,
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        width: "60%",
        margin: "40px auto",
        background: "white",
        padding: 25,
        borderRadius: 20,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
      }}>
        <h2 style={{ color: "#1f7a73", textAlign: "center", marginBottom: 20 }}>
          Создать новую тему
        </h2>

        <input
          type="text"
          placeholder="Название темы"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #4fd1c5",
            marginBottom: 15,
            fontSize: 16
          }}
        />

        <textarea
          placeholder="Содержание темы"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{
            width: "100%",
            height: 150,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #4fd1c5",
            marginBottom: 15,
            fontSize: 16,
            resize: "vertical"
          }}
        />

        <input
          type="text"
          placeholder="Автор"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #4fd1c5",
            marginBottom: 20,
            fontSize: 16
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: 14,
            background: "#4fd1c5",
            border: "none",
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            borderRadius: 12,
            cursor: "pointer"
          }}
        >
          Создать тему
        </button>
      </div>
    </div>
  );
}
