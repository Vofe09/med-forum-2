// ===== POST =====
if (req.method === "POST") {
  // 🔒 проверка авторизации
  const cookie = req.headers.cookie
    ?.split("; ")
    .find(c => c.startsWith("user="));

  if (!cookie) {
    return res.status(401).json({ error: "Необходимо войти в аккаунт" });
  }

  let user;
  try {
    user = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return res.status(401).json({ error: "Неверная сессия" });
  }

  const { text } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ error: "Пустое сообщение" });
  }

  // 🔍 ===== DEBUG ПРОВЕРКА =====
  console.log("DB NAME:", process.env.DB_NAME);
  console.log("USER ID FROM COOKIE:", user.id, typeof user.id);

  const [check] = await pool.query(
    "SELECT id FROM users WHERE id = ?",
    [user.id]
  );

  console.log("USER EXISTS IN USERS TABLE:", check);
  // 🔍 ==========================

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1️⃣ записываем сообщение
    await conn.query(
      "INSERT INTO messages (subtopic_id, user_id, text) VALUES (?, ?, ?)",
      [subtopicId, user.id, text]
    );

    // 2️⃣ обновляем счётчики
    await conn.query(
      `UPDATE users
       SET posts_count = posts_count + 1,
           reputation = reputation + 10
       WHERE id = ?`,
      [user.id]
    );

    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error("MESSAGES API ERROR:", err);
    return res.status(500).json({
      error: err.message,
      code: err.code
    });
  } finally {
    conn.release();
  }
}
