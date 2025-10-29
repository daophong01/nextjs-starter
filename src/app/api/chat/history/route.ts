import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/chat/history
 * Admin-only: list all messages (last 200)
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  // basic admin check
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await prisma.chatMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { email: true, name: true } } },
  });

  return NextResponse.json({ items });
}