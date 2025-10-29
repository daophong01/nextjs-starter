import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const id = String((body as any)?.id || "");
  const email = String((body as any)?.email || "");
  const message = String((body as any)?.message || "");
  if (!id || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const contact = await prisma.contactMessage.findUnique({ where: { id } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await sendEmail({
    to: email,
    subject: "Phản hồi liên hệ từ TravelGo",
    html: `<p>${message}</p>`,
  }).catch(() => {});

  await prisma.contactMessage.update({
    where: { id },
    data: { processed: true },
  });

  return NextResponse.json({ ok: true });
}