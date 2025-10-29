import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import InvoiceEmail from "@/emails/InvoiceEmail";

/**
 * GET /api/invoice?bookingId=...
 * Returns HTML invoice for a booking.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId") || "";
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const b = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const html = render(
    InvoiceEmail({
      bookingId: b.id,
      name: b.name,
      destination: b.destination || undefined,
      guests: b.guests,
      from: b.from || undefined,
      to: b.to || undefined,
      subtotal: b.price,
      discount: b.discountAmount || 0,
      serviceFee: b.serviceFee || 0,
      tax: b.tax || 0,
      total: b.totalAmount || b.price,
      createdAt: b.createdAt?.toISOString(),
    })
  );

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}