import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import ReceiptEmail from "@/emails/ReceiptEmail";

/**
 * GET /api/receipt?bookingId=...
 * Returns HTML receipt for a booking.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId") || "";
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const b = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (b.status !== "paid") return NextResponse.json({ error: "Booking not paid" }, { status: 400 });

  const html = render(
    ReceiptEmail({
      bookingId: b.id,
      name: b.name,
      total: b.totalAmount || b.price,
      paymentMethod: b.paymentMethod || "Stripe",
      paidAt: new Date().toISOString(),
    })
  );

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}