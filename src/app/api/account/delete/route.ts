import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete related records (NextAuth cascades handle accounts/sessions)
  await prisma.booking.deleteMany({ where: { email: user.email } });
  await prisma.review.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}