import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReviewCreateSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") || "").trim();

  const list = await prisma.review.findMany({
    where: slug ? { slug } : undefined,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(list.map((r) => ({
    id: r.id,
    slug: r.slug,
    author: r.author,
    rating: r.rating,
    comment: r.comment,
    date: r.date,
  })));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ReviewCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { slug, author, rating, comment } = parsed.data;
  const date = new Date().toISOString().slice(0, 10);

  const created = await prisma.review.create({
    data: {
      slug,
      author: author || "Khách ẩn danh",
      rating,
      comment,
      date,
    },
  });

  return NextResponse.json(created, { status: 201 });
}