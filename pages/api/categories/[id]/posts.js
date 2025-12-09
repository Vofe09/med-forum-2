import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await db.query(
        'SELECT * FROM posts WHERE thread_id = ? ORDER BY created_at ASC',
        [id]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при получении сообщений' });
    }
  } else if (req.method === 'POST') {
    const { author, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Сообщение не может быть пустым' });

    try {
      const [result] = await db.query(
        'INSERT INTO posts (thread_id, author, content) VALUES (?, ?, ?)',
        [id, author || 'Guest', content]
      );
      // Обновляем last_activity темы
      await db.query('UPDATE threads SET last_activity = CURRENT_TIMESTAMP WHERE id = ?', [id]);
      res.status(201).json({ id: result.insertId, author, content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при добавлении сообщения' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешён' });
  }
}
