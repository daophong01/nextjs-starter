import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/chat
 * Body: { message: string }
 * Stores a chat message associated with the current user.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const message = String((body as any)?.message || "").trim();
  if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });

  const saved = await prisma.chatMessage.create({
    data: { userId: user.id, message },
  });

  return NextResponse.json({ ok: true, id: saved.id, createdAt: saved.createdAt });
}

/**
 * GET /api/chat
 * Returns last 50 messages of current user.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const items = await prisma.chatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ items });
}