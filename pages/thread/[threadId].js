import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Thread() {
  const router = useRouter();
  const { threadId } = router.query;

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (!threadId) return;
    fetch(`/api/threads/${threadId}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, [threadId]);

  const handleAddPost = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/threads/${threadId}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content }),
    });
    const newPost = await res.json();
    setPosts([...posts, newPost]);
    setContent("");
    setAuthor("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Тема {threadId}</h1>

      <form onSubmit={handleAddPost} style={{ marginBottom: "20px" }}>
        <h3>Написать сообщение</h3>
        <input
          placeholder="Ваше имя"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Сообщение"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          style={{ width: "100%" }}
        />
        <button type="submit">Отправить</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <b>{post.author || "Guest"}:</b> {post.content} <i>({post.created_at})</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
