import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { render } from "@react-email/render";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import { sendEmail } from "@/lib/mailer";

async function verifyTurnstile(token: string | undefined, remoteip?: string) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true; // not configured
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
      ...(remoteip ? { remoteip } : {}),
    }).toString(),
  });
  const data = await res.json().catch(() => ({}));
  return Boolean(data.success);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String((body as any)?.email || "").toLowerCase().trim();
  const captchaToken = String((body as any)?.turnstileToken || "");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  const validCaptcha = await verifyTurnstile(captchaToken, ip);
  if (!validCaptcha) {
    return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Always respond success to avoid user enumeration
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h
  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expires },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const html = render(ResetPasswordEmail({ resetLink }));
  await sendEmail({
    to: email,
    subject: "Đặt lại mật khẩu",
    html,
  });

  return NextResponse.json({ ok: true });
}