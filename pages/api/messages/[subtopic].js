// pages/api/messages/[subtopic].js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { subtopic } = req.query;

  /* =======================
     GET — загрузка сообщений
     ======================= */
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          m.id,
          m.text,
          m.created_at,
          u.username AS user
        FROM messages m
        JOIN users u ON u.id = m.user_id
        WHERE m.subtopic_id = ?
        ORDER BY m.created_at ASC
        `,
        [subtopic]
      );

      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка чтения сообщений' });
    }
  }

  /* =======================
     POST — отправка сообщения
     ======================= */
  if (req.method === 'POST') {
    // 🔒 проверяем авторизацию
    const cookie = req.headers.cookie
      ?.split('; ')
      .find(c => c.startsWith('user='));

    if (!cookie) {
      return res.status(401).json({ error: 'Необходимо войти в аккаунт' });
    }

    let user;
    try {
      user = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch {
      return res.status(401).json({ error: 'Неверная сессия' });
    }

    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Пустое сообщение' });
    }

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // 1️⃣ добавляем сообщение
      await conn.query(
        `
        INSERT INTO messages (subtopic_id, user_id, text)
        VALUES (?, ?, ?)
        `,
        [subtopic, user.id, text.trim()]
      );

      // 2️⃣ обновляем счётчики пользователя
      await conn.query(
        `
        UPDATE users
        SET posts_count = posts_count + 1,
            reputation = reputation + 10
        WHERE id = ?
        `,
        [user.id]
      );

      await conn.commit();
      return res.status(201).json({ success: true });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      return res.status(500).json({ error: 'Ошибка записи сообщения' });
    } finally {
      conn.release();
    }
  }

  /* =======================
     OTHER METHODS
     ======================= */
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Метод ${req.method} не разрешён`);
}
