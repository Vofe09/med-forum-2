// pages/forum/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Forum() {
  const [categories, setCategories] = useState([]);
  const [rootThreads, setRootThreads] = useState([]);

  const [catTitle, setCatTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const [threadTitle, setThreadTitle] = useState("");
  const [threadSlug, setThreadSlug] = useState("");
  const [threadAuthor, setThreadAuthor] = useState("");

  useEffect(() => {
    // Загрузка категорий
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));

    // Загрузка корневых тем
    fetch("/api/threads/root")
      .then(res => res.json())
      .then(data => setRootThreads(Array.isArray(data) ? data : []))
      .catch(() => setRootThreads([]));
  }, []);

  const handleCreateCategory = async e => {
    e.preventDefault();
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: catTitle, slug: catSlug, description: catDesc }),
    });
    const newCat = await res.json();
    setCategories([newCat, ...categories]);
    setCatTitle(""); setCatSlug(""); setCatDesc("");
  };

  const handleCreateRootThread = async e => {
    e.preventDefault();
    const res = await fetch("/api/threads/root", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: threadTitle, slug: threadSlug, author: threadAuthor }),
    });
    const newThread = await res.json();
    setRootThreads([newThread, ...rootThreads]);
    setThreadTitle(""); setThreadSlug(""); setThreadAuthor("");
  };

  return (
    <div className="container">
      <h1>Форум</h1>

      {/* Форма создания категории */}
      <form onSubmit={handleCreateCategory} className="form">
        <h3>Создать категорию</h3>
        <input placeholder="Название" value={catTitle} onChange={e => setCatTitle(e.target.value)} required />
        <input placeholder="Slug" value={catSlug} onChange={e => setCatSlug(e.target.value)} required />
        <input placeholder="Описание" value={catDesc} onChange={e => setCatDesc(e.target.value)} />
        <button type="submit">Создать категорию</button>
      </form>

      {/* Форма создания корневой темы */}
      <form onSubmit={handleCreateRootThread} className="form">
        <h3>Создать тему в корне</h3>
        <input placeholder="Название темы" value={threadTitle} onChange={e => setThreadTitle(e.target.value)} required />
        <input placeholder="Slug темы" value={threadSlug} onChange={e => setThreadSlug(e.target.value)} required />
        <input placeholder="Автор" value={threadAuthor} onChange={e => setThreadAuthor(e.target.value)} />
        <button type="submit">Создать тему</button>
      </form>

      {/* Корневые темы */}
      <h2>Темы в корне</h2>
      <ul className="categories">
        {rootThreads.map(thread => (
          <li key={thread.id} className="category-card">
            <Link href={`/thread/${thread.id}`}>
              <div className="card-content">
                <h3>{thread.title}</h3>
                <p>Автор: {thread.author || "Guest"}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Список категорий */}
      <h2>Категории</h2>
      <ul className="categories">
        {categories.map(cat => (
          <li key={cat.id} className="category-card">
            <Link href={`/forum/${cat.id}`}>
              <div className="card-content">
                <h3>{cat.title}</h3>
                <p>{cat.description || "Нет описания"}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .container {
          padding: 20px;
          background-color: #e6f8f7;
          min-height: 100vh;
          color: #1e293b;
        }
        h1 {
          color: #1f7a73;
        }
        .form {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #d0f8f5;
          border-radius: 10px;
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
        .form button:hover {
          background-color: #1f7a73;
        }
        .categories {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }
        .category-card {
          background-color: #d0f8f5;
          border-left: 5px solid #4fd1c5;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
        }
        .category-card:hover {
          background-color: #a0f0ea;
          transform: translateY(-3px);
        }
        .card-content h3 {
          margin: 0 0 8px;
          color: #1f7a73;
        }
        .card-content p {
          margin: 0;
          color: #1e293b;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
