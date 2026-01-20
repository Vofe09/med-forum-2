export const config = { runtime: "nodejs" };

import { sendVerificationEmail } from "../../lib/mail";

export default async function handler(req, res) {
  await sendVerificationEmail("ТВОЯ_ПОЧТА@gmail.com", "123456");
  res.status(200).json({ ok: true });
}
