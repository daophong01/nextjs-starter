import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String((body as any)?.email || "").toLowerCase().trim();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

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

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "TravelGo <noreply@travelgo.example>",
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `
          <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
            <p>Xin chào${user.name ? " " + user.name : ""},</p>
            <p>Nhấn vào liên kết sau để đặt lại mật khẩu (hiệu lực 1 giờ):</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
          </div>
        `,
      });
    } catch {
      // ignore email errors
    }
  }

  return NextResponse.json({ ok: true });
}