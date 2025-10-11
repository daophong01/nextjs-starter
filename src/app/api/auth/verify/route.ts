import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const token = String((body as any).token || "");
  const email = String((body as any).email || "").toLowerCase().trim();
  if (!token || !email) {
    return NextResponse.json({ error: "Missing token/email" }, { status: 400 });
  }

  const rec = await prisma.verificationToken.findUnique({ where: { token } });
  if (!rec || rec.identifier !== email || new Date(rec.expires).getTime() < Date.now()) {
    return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}