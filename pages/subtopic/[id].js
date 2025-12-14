// pages/subtopic/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Subtopic() {
  const router = useRouter();
  const { id } = router.query;

  // Пример "базы данных" сообщений для разных подфорумов
  const initialMessagesData = {
    '1-1': [
      { user: 'Alice', text: 'Привет! Как сдать экзамен по анатомии?', date: '2025-12-14 10:23' },
      { user: 'Bob', text: 'Я рекомендую смотреть лекции профессора Иванова.', date: '2025-12-14 11:05' },
    ],
    '1-2': [
      { user: 'Dr.Smith', text: 'Нужно помнить про протокол 2025 года.', date: '2025-12-14 09:45' },
    ],
    // Добавьте остальные subtopics по аналогии
  };

  const [messages, setMessages] = useState([]);

  // Загружаем сообщения при смене subtopic
  useEffect(() => {
    if (!id) return;
    setMessages(initialMessagesData[id] || []);
  }, [id]);

  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      user: 'Вы',
      text: newMessage.trim(),
      date: new Date().toLocaleString('ru-RU', { hour12: false }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="theme-dark">
      <header className="topbar">
        <div className="container">
          <div className="logo">Arizona RP</div>
          <nav className="nav">
            <Link href="/">Форумы</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <h2 className="subtopic-title">Subtopic: {id}</h2>

        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <div className="message-user">{msg.user}</div>
              <div className="message-text">{msg.text}</div>
              <div className="message-date">{msg.date}</div>
            </div>
          ))}
        </div>

        <div className="message-input">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
          />
          <button onClick={handleSend}>Отправить</button>
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
