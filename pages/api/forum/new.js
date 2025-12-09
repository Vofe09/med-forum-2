// pages/api/forum/new.js

// Временное хранилище тем (обнуляется при перезапуске сервера)
let threads = [];
let nextId = 1;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { title, text, author } = req.body;

    if (!title || !text || !author) {
      return res.status(400).json({ success: false, message: "Заполните все поля" });
    }

    const newThread = {
      id: nextId++,
      title,
      text,
      author,
      createdAt: new Date().toISOString(),
    };

    threads.push(newThread);

    return res.status(200).json({ success: true, threadId: newThread.id });
  }

  if (req.method === "GET") {
    return res.status(200).json({ threads });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
