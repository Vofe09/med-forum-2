// pages/subtopic/[id].js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Subtopic() {
  const router = useRouter();
  const { id } = router.query;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Проверка авторизации (cookie user)
  const isAuth =
    typeof document !== 'undefined' &&
    document.cookie.includes('user=');

  /* =======================
     Загрузка сообщений
     ======================= */
  const loadMessages = async (subtopicId, signal) => {
    if (!subtopicId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(subtopicId)}`, {
        method: 'GET',
        signal,
      });

      if (!res.ok) {
        throw new Error(`Ошибка загрузки: ${res.status}`);
      }

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setError('Не удалось загрузить сообщения');
        setMessages([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Загружаем сообщения при смене id
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    loadMessages(id, controller.signal);
    return () => controller.abort();
  }, [id]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /* =======================
     Отправка сообщения
     ======================= */
  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || !id || sending || !isAuth) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Ошибка сервера: ${res.status}`);
      }

      await loadMessages(id);
      setNewMessage('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="theme-dark">
      <Head>
        <title>{id ? `Подфорум — ${id}` : 'Подфорум'}</title>
        <link rel="stylesheet" href="/css/subtopic.css" />
      </Head>

      <header className="topbar">
        <div className="container">
          <div className="logo">Arizona RP</div>
          <nav className="nav">
            <Link href="/">Форумы</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <h2 className="subtopic-title">
          {id ? `Подфорум: ${id}` : 'Подфорум'}
        </h2>

        {loading && <div>Загрузка сообщений…</div>}
        {error && (
          <div style={{ color: 'var(--accent)', marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div className="messages" aria-live="polite">
          {messages.length === 0 && !loading && (
            <div className="message">Сообщений пока нет.</div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="message">
              <div className="message-user">{msg.user}</div>
              <div className="message-text">{msg.text}</div>
              <div className="message-date">
                {new Date(msg.created_at).toLocaleString('ru-RU', {
                  hour12: false,
                })}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* ===== INPUT ===== */}
        <div className="message-input">
          {!isAuth && (
            <div style={{ color: 'var(--muted)', marginBottom: 10 }}>
              Чтобы написать сообщение,{' '}
              <Link href="/login">войдите</Link> или{' '}
              <Link href="/register">зарегистрируйтесь</Link>.
            </div>
          )}

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            disabled={!isAuth || sending}
          />

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <button
              onClick={handleSend}
              disabled={!isAuth || sending || newMessage.trim() === ''}
            >
              {sending ? 'Отправка…' : 'Отправить'}
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <span>© Arizona RP</span>
          <nav>
            <Link href="#">Контакты</Link>
            <Link href="#">Правила</Link>
            <Link href="#">Помощь</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
