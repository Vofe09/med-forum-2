// pages/forum/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Forum() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="container">
      <h1>Форум</h1>
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
          background-color: var(--bg-light);
          min-height: 100vh;
          font-family: sans-serif;
          color: var(--text-dark);
        }

        h1 {
          margin-bottom: 20px;
          color: var(--blue-dark);
        }

        .categories {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }

        .category-card {
          background-color: var(--soft-blue);
          border-left: 5px solid var(--blue-main);
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
        }

        .category-card:hover {
          background-color: var(--blue-hover);
          transform: translateY(-3px);
        }

        .card-content h3 {
          margin: 0 0 8px;
          color: var(--blue-dark);
        }

        .card-content p {
          margin: 0;
          color: var(--text-dark);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
