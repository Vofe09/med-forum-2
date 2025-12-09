// pages/thread/[threadId].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ThreadPage() {
  const router = useRouter();
  const { threadId } = router.query;

  const [thread, setThread] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  useEffect(() => {
    if (!threadId) return;
    fetch(`/api/threads/${threadId}`)
      .then(res => res.json())
      .then(data => setThread(data))
      .catch(() => setThread(null));
  }, [threadId]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/threads/root`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, slug: newSlug, author: newAuthor }),
    });
    const newThread = await res.json();
    setNewTitle(""); setNewSlug(""); setNewAuthor("");
    alert(`Тема "${newThread.title}" создана!`);
  };

  if (!thread) return <div style={{ padding: "20px" }}>Загрузка темы...</div>;

  return (
    <div className="container">
      <h1>{thread.title}</h1>
      <p className="author">Автор: {thread.author || "Guest"}</p>

      <div className="description">
        <h3>Описание темы</h3>
        <p>{thread.description || "Описание отсутствует"}</p>
      </div>

      <form onSubmit={handleCreateThread} className="form">
        <h3>Создать новую тему</h3>
        <input placeholder="Название темы" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
        <input placeholder="Slug темы" value={newSlug} onChange={e => setNewSlug(e.target.value)} required />
        <input placeholder="Автор" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} />
        <button type="submit">Создать тему</button>
      </form>

      <Link href="/forum">
        <a className="back-link">← Вернуться к форуму</a>
      </Link>

      <style jsx>{`
        .container {
          padding: 20px;
          background-color: #e6f8f7;
          min-height: 100vh;
          color: #1e293b;
        }
        h1 { color: #1f7a73; margin-bottom: 5px; }
        .author { color: #34d399; margin-bottom: 15px; font-weight: bold; }
        .description {
          background-color: #d0f8f5;
          padding: 15px;
          border-left: 5px solid #4fd1c5;
          border-radius: 10px;
          margin-bottom: 25px;
        }
        .description h3 { margin-top: 0; color: #1f7a73; }
        .description p { margin: 0; color: #1e293b; font-size: 0.95rem; }

        .form {
          padding: 15px;
          background-color: #d0f8f5;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .form input {
          display: block;
          width: 100%;
          margin: 5px 0;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #76e0d1;
        }
        .form button {
          margin-top: 10px;
          padding: 8px 15px;
          background-color: #4fd1c5;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
        }
        .form button:hover { background-color: #1f7a73; }

        .back-link {
          display: inline-block;
          margin-top: 15px;
          color: #1f7a73;
          text-decoration: none;
        }
        .back-link:hover { color: #4fd1c5; }
      `}</style>
    </div>
  );
}
