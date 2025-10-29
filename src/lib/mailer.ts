import { Resend } from "resend";
import nodemailer from "nodemailer";

export async function sendEmail(opts: { to: string; subject: string; html: string; from?: string }) {
  const from = opts.from || process.env.RESEND_FROM || "TravelGo <noreply@travelgo.example>";
  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      });
      return true;
    } catch {
      // fall through to SMTP
    }
  }

  // Fallback to SMTP (Nodemailer)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    return true;
  }

  return false;
}