// lib/mail.js
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export async function sendVerificationEmail(email, code) {
  const sentFrom = new Sender("no-reply@test-69oxl5eo2pkl785k.mlsender.net", "Med.Unit");
  const recipients = [new Recipient(email)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Код подтверждения")
    .setText(`Ваш код подтверждения: ${code}\n\nКод действует 10 минут.`);

  await mailerSend.email.send(emailParams);
}
