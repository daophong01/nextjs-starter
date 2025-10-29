import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  return NextResponse.json({ ok: true, id: saved.id });
}