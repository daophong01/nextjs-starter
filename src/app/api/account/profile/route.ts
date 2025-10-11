import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const name = String((body as any).name || "").trim();
  const image = String((body as any).image || "").trim();

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: name || null,
      image: image || null,
    },
  });

  return NextResponse.json({ ok: true, name: updated.name, image: updated.image });
}