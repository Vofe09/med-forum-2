// pages/api/messages/[subtopic].js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { subtopic } = req.query;

  if (req.method === 'GET') {
    // Получаем все сообщения по подфоруму
    try {
      const [rows] = await db.query(
        'SELECT id, user, text, created_at FROM messages WHERE subtopic_id = ? ORDER BY created_at ASC',
        [subtopic]
      );
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка чтения сообщений' });
    }
  } else if (req.method === 'POST') {
    const { user, text } = req.body;
    if (!text || !user) {
      return res.status(400).json({ error: 'Неверные данные' });
    }

    try {
      const [result] = await db.query(
        'INSERT INTO messages (subtopic_id, user, text) VALUES (?, ?, ?)',
        [subtopic, user, text]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка записи сообщения' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Метод ${req.method} не разрешён`);
  }
}
