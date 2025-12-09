import db from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [threads] = await db.query(
        'SELECT * FROM threads WHERE category_id = ? ORDER BY created_at DESC',
        [id]
      );
      res.status(200).json(Array.isArray(threads) ? threads : []);
    } catch (error) {
      console.error(error);
      res.status(500).json([]);
    }
  } else if (req.method === 'POST') {
    const { title, slug, author } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ message: 'Название и slug темы обязательны' });
    }
    try {
      const [result] = await db.query(
        'INSERT INTO threads (category_id, title, slug, author) VALUES (?, ?, ?, ?)',
        [id, title, slug, author || 'Guest']
      );
      const newThread = { id: result.insertId, title, slug, author: author || 'Guest' };
      res.status(201).json(newThread);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при создании темы' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешён' });
  }
}
