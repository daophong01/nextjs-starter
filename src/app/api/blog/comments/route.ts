import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "";
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (!post) return NextResponse.json({ items: [] });

  const items = await prisma.comment.findMany({
    where: { postId: post.id, approved: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const slug = String((body as any)?.slug || "");
  const name = String((body as any)?.name || "");
  const email = String((body as any)?.email || "");
  const content = String((body as any)?.content || "");

  if (!slug || !name || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const created = await prisma.comment.create({
    data: {
      postId: post.id,
      name,
      email,
      content,
      approved: false,
    },
  });

  return NextResponse.json({ ok: true, id: created.id });
}