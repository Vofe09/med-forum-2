// pages/forum/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Forum() {
  const [categories, setCategories] = useState([]);
  const [rootThreads, setRootThreads] = useState([]);

  // Поля для создания категорий
  const [catTitle, setCatTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Поля для создания корневых тем
  const [threadTitle, setThreadTitle] = useState("");
  const [threadSlug, setThreadSlug] = useState("");
  const [threadAuthor, setThreadAuthor] = useState("");

  useEffect(() => {
    // Загружаем категории
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));

    // Загружаем корневые темы (без категории)
    fetch("/api/threads/root")
      .then(res => res.json())
      .then(data => setRootThreads(Array.isArray(data) ? data : []));
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

      {/* Создание категории */}
      <form onSubmit={handleCreateCategory} className="form">
        <h3>Создать категорию</h3>
        <input placeholder="Название" value={catTitle} onChange={e => setCatTitle(e.target.value)} required />
        <input placeholder="Slug" value={catSlug} onChange={e => setCatSlug(e.target.value)} required />
        <input placeholder="Описание" value={catDesc} onChange={e => setCatDesc(e.target.value)} />
        <button type="submit">Создать категорию</button>
      </form>

      {/* Создание корневой темы */}
      <form onSubmit={handleCreateRootThread} className="form">
        <h3>Создать тему в корне</h3>
        <input placeholder="Название темы" value={threadTitle} onChange={e => setThreadTitle(e.target.value)} required />
        <input placeholder="Slug темы" value={threadSlug} onChange={e => setThreadSlug(e.target.value)} required />
        <input placeholder="Автор" value={threadAuthor} onChange={e => setThreadAuthor(e.target.value)} />
        <button type="submit">Создать тему</button>
      </form>

      {/* Список корневых тем */}
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
        .container { padding: 20px; background-color: var(--bg-light); min-height: 100vh; color: var(--text-dark); }
        h1 { color: var(--blue-dark); }
        .form { margin-bottom: 20px; padding: 15px; background-color: var(--soft-blue); border-radius: 10px; }
        .form input { display: block; width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid var(--blue-light); }
        .form button { margin-top: 10px; padding: 8px 15px; background-color: var(--blue-main); border: none; border-radius: 5px; color: white; cursor: pointer; }
        .form button:hover { background-color: var(--blue-dark); }
        .categories { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
        .category-card { background-color: var(--soft-blue); border-left: 5px solid var(--blue-main); padding: 15px; border-radius: 10px; cursor: pointer; transition: background-color 0.2s, transform 0.2s; }
        .category-card:hover { background-color: var(--blue-hover); transform: translateY(-3px); }
        .card-content h3 { margin: 0 0 8px; color: var(--blue-dark); }
        .card-content p { margin: 0; color: var(--text-dark); font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
