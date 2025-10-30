import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { POSTS } from "@/data/blog";

export async function GET() {
  try {
    const list = await prisma.post.findMany({
      orderBy: { date: "desc" },
      include: { comments: true, categories: { include: { category: true } } },
      take: 100,
    });
    if (list.length > 0) {
      return NextResponse.json(list);
    }
  } catch {
    // ignore
  }
  // fallback seed
  return NextResponse.json(POSTS);
}