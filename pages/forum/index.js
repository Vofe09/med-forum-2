import { useEffect, useState } from "react";
import Link from "next/link";

export default function Forum() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description }),
    });
    const newCat = await res.json();
    setCategories([newCat, ...categories]);
    setTitle("");
    setSlug("");
    setDescription("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Форум</h1>

      <form onSubmit={handleCreateCategory} style={{ marginBottom: "20px" }}>
        <h3>Создать новую категорию</h3>
        <input
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <input
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Создать</button>
      </form>

      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link href={`/forum/${cat.id}`}>
              <a>{cat.title}</a>
            </Link>{" "}
            - {cat.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
