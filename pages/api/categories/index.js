import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при получении категорий' });
    }
  } else if (req.method === 'POST') {
    // Создание новой категории
    const { title, description, slug } = req.body;
    if (!title || !slug) return res.status(400).json({ message: 'Title и slug обязательны' });

    try {
      const [result] = await db.query(
        'INSERT INTO categories (title, description, slug) VALUES (?, ?, ?)',
        [title, description || '', slug]
      );
      res.status(201).json({ id: result.insertId, title, description, slug });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при создании категории' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешён' });
  }
}
