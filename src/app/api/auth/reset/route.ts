import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = String((body as any)?.token || "");
  const password = String((body as any)?.password || "");
  if (!token || !password) {
    return NextResponse.json({ error: "Missing token/password" }, { status: 400 });
  }

  const rec = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!rec || new Date(rec.expires).getTime() < Date.now()) {
    return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: rec.userId },
    data: { passwordHash: hash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}