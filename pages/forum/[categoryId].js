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
      .then((data) => setThreads(data));
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
    <div style={{ padding: "20px" }}>
      <h1>Темы категории {categoryId}</h1>

      <form onSubmit={handleCreateThread} style={{ marginBottom: "20px" }}>
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

      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>
            <Link href={`/thread/${thread.id}`}>
              <a>{thread.title}</a>
            </Link>{" "}
            - {thread.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
