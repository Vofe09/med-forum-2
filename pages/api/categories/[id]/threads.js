import db from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await db.query(
        'SELECT * FROM threads WHERE category_id = ? ORDER BY last_activity DESC',
        [id]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при получении тем' });
    }
  } else if (req.method === 'POST') {
    const { title, author, slug } = req.body;
    if (!title || !slug) return res.status(400).json({ message: 'Title и slug обязательны' });

    try {
      const [result] = await db.query(
        'INSERT INTO threads (category_id, title, author, slug) VALUES (?, ?, ?, ?)',
        [id, title, author || 'Guest', slug]
      );
      res.status(201).json({ id: result.insertId, title, author, slug });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при создании темы' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешён' });
  }
}
