import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ForumTopic() {
  const router = useRouter();
  const { id } = router.query;

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadTopic() {
      try {
        const res = await fetch(`/api/topics/get?id=${id}`);

        if (!res.ok) {
          console.error("Ошибка загрузки темы");
          return;
        }

        const data = await res.json();
        setTopic(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTopic();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!topic) return <p>Тема не найдена</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{topic.title}</h1>
      <p style={{ marginTop: 10 }}>{topic.content}</p>
    </div>
  );
}
