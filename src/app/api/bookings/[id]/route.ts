import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}));
  const { status, paymentId } = body as { status?: string; paymentId?: string };

  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: {
      status: status as any,
      paymentId: paymentId || undefined,
    },
  });

  return NextResponse.json({ data: booking });
}

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: { status: "PAID" },
  });
  return NextResponse.json({ data: booking });
}