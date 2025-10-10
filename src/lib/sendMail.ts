import nodemailer from "nodemailer";
import type { Booking } from "@prisma/client";

export async function sendBookingEmail(booking: Booking) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM = "no-reply@travelx.local",
  } = process.env as Record<string, string | undefined>;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log("Email disabled. Booking:", booking);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: MAIL_FROM,
    to: booking.email,
    subject: `Xác nhận yêu cầu đặt chỗ - ${booking.fullName}`,
    text: `Cảm ơn bạn đã gửi yêu cầu đặt chỗ.\nMã đơn: ${booking.id}\nSố người: ${booking.travelers}\nKhởi hành: ${booking.startDate || "linh hoạt"}`,
  });

  return info;
}