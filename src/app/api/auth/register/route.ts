import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";
import { render } from "@react-email/render";
import VerifyEmail from "@/emails/VerifyEmail";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const name = String((body as any).name || "").trim();
  const email = String((body as any).email || "").toLowerCase().trim();
  const password = String((body as any).password || "");
  if (!email || !password) {
    return NextResponse.json({ error: "Missing email/password" }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email đã tồn tại" }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name: name || null, passwordHash, role: "user" },
  });

  // Create verification token (using NextAuth VerificationToken model)
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyLink = `${baseUrl}/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const emailHtml = render(VerifyEmail({ name, verifyLink }));
      await resend.emails.send({
        from: process.env.RESEND_FROM || "TravelGo <noreply@travelgo.example>",
        to: email,
        subject: "Xác thực email",
        html: emailHtml,
      });
    } catch {
      // ignore email errors
    }
  }

  return NextResponse.json({ id: user.id, email: user.email, verifySent: Boolean(process.env.RESEND_API_KEY) });
}