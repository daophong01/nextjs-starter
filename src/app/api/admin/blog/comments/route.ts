import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { status: 401 as const, user: null };
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") return { status: 403 as const, user: null };
  return { status: 200 as const, user };
}

export async function GET() {
  const { status } = await ensureAdmin();
  if (status !== 200) return NextResponse.json({ error: status === 401 ? "Unauthorized" : "Forbidden" }, { status });

  const items = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { post: true, user: true },
  });
  return NextResponse.json({ items });
}

export async function PATCH(request: Request) {
  const { status } = await ensureAdmin();
  if (status !== 200) return NextResponse.json({ error: status === 401 ? "Unauthorized" : "Forbidden" }, { status });

  const body = await request.json().catch(() => null);
  const id = String((body as any)?.id || "");
  const approved = Boolean((body as any)?.approved);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updated = await prisma.comment.update({ where: { id }, data: { approved } });
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(request: Request) {
  const { status } = await ensureAdmin();
  if (status !== 200) return NextResponse.json({ error: status === 401 ? "Unauthorized" : "Forbidden" }, { status });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}