// pages/forum/[categoryId].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Category() {
  const router = useRouter();
  const { categoryId } = router.query;

  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (!categoryId) return;
    fetch(`/api/categories/${categoryId}/threads`)
      .then((res) => res.json())
      .then((data) => setThreads(Array.isArray(data) ? data : []))
      .catch(() => setThreads([]));
  }, [categoryId]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/categories/${categoryId}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, author }),
    });
    const newThread = await res.json();
    setThreads([newThread, ...threads]);
    setTitle("");
    setSlug("");
    setAuthor("");
  };

  return (
    <div className="container">
      <h1>Темы категории {categoryId}</h1>

      {/* Форма создания темы */}
      <form onSubmit={handleCreateThread} className="form">
        <h3>Создать новую тему</h3>
        <input
          placeholder="Название темы"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Slug темы"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <input
          placeholder="Автор"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="submit">Создать тему</button>
      </form>

      {/* Список тем */}
      <ul className="threads">
        {threads.map((thread) => (
          <li key={thread.id} className="thread-card">
            <Link href={`/thread/${thread.id}`}>
              <div className="card-content">
                <h3>{thread.title}</h3>
                <p className="author">Автор: {thread.author || "Guest"}</p>
                <p className="description">
                  {thread.description
                    ? thread.description.length > 120
                      ? thread.description.slice(0, 120) + "..."
                      : thread.description
                    : "Описание отсутствует"}
                </p>
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
          margin-bottom: 20px;
        }
        .form {
          padding: 15px;
          background-color: #d0f8f5;
          border-radius: 10px;
          margin-bottom: 25px;
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

        .threads {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }
        .thread-card {
          background-color: #d0f8f5;
          border-left: 5px solid #4fd1c5;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
        }
        .thread-card:hover {
          background-color: #a0f0ea;
          transform: translateY(-3px);
        }
        .card-content h3 {
          margin: 0 0 8px;
          color: #1f7a73;
        }
        .card-content .author {
          margin: 0 0 8px;
          color: #34d399;
          font-size: 0.9rem;
        }
        .card-content .description {
          margin: 0;
          color: #1e293b;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
