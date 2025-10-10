import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const items = await prisma.destination.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { slug, name, description, image, rating, price, country, tags } = body as any;
  if (!slug || !name) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const created = await prisma.destination.create({
    data: {
      slug,
      name,
      description,
      image,
      rating: Number(rating || 0),
      price: Number(price || 0),
      country,
      tags: Array.isArray(tags) ? tags.join(",") : String(tags || ""),
    },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const { slug, ...rest } = body as any;
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const updated = await prisma.destination.update({
    where: { slug },
    data: {
      ...rest,
      tags: Array.isArray(rest.tags) ? rest.tags.join(",") : rest.tags,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  await prisma.destination.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
}