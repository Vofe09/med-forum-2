import fs from "fs";
import path from "path";
import formidable from "formidable";
import pool from "../../../lib/db";
import cookie from "cookie";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { sid } = cookie.parse(req.headers.cookie || "");
  if (!sid) return res.status(401).json({ error: "Not authorized" });

  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Upload error" });
    }

    const file = files.avatar;
    if (!file) {
      return res.status(400).json({ error: "No file" });
    }

    const ext = path.extname(file.originalFilename).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return res.status(400).json({ error: "Unsupported format" });
    }

    const filename = `avatar_${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
    const filepath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.renameSync(file.filepath, filepath);

    try {
      await pool.query(
        `
        UPDATE users u
        JOIN sessions s ON s.user_id = u.id
        SET u.avatar = ?
        WHERE s.id = ?
        `,
        [`/uploads/avatars/${filename}`, sid]
      );

      return res.status(200).json({
        avatar: `/uploads/avatars/${filename}`,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "DB error" });
    }
  });
}
