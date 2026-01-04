import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [categories] = await db.query('SELECT * FROM categories ORDER BY id DESC');
      // всегда возвращаем массив
      res.status(200).json(Array.isArray(categories) ? categories : []);
    } catch (error) {
      console.error(error);
      res.status(500).json([]);
    }
  } else if (req.method === 'POST') {
    const { title, slug, description } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ message: 'Название и slug обязательны' });
    }
    try {
      const [result] = await db.query(
        'INSERT INTO categories (title, slug, description) VALUES (?, ?, ?)',
        [title, slug, description || '']
      );
      const newCategory = { id: result.insertId, title, slug, description };
      res.status(201).json(newCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при создании категории' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешён' });
  }
}
