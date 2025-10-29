import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json().catch(() => null);
  const name = String((body as any)?.name || "").trim();
  const email = String((body as any)?.email || "").trim();
  const message = String((body as any)?.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  const saved = await prisma.contactMessage.create({
    data: {
      name,
      email,
      message,
      userId: user?.id || null,
    },
  });

  // Send notification to support and confirmation to user (best-effort)
  const supportEmail = process.env.SUPPORT_EMAIL || "support@travelgo.example";
  const subject = `Liên hệ mới từ ${name}`;
  const html = `<h3>Liên hệ mới</h3><p><b>Tên:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Nội dung:</b> ${message}</p>`;
  await sendEmail({ to: supportEmail, subject, html }).catch(() => {});
  await sendEmail({
    to: email,
    subject: "Đã nhận liên hệ của bạn",
    html: `<p>Chúng tôi đã nhận liên hệ: "${message}". Đội ngũ sẽ phản hồi sớm.</p>`,
  }).catch(() => {});

  return NextResponse.json({ ok: true, id: saved.id });
}