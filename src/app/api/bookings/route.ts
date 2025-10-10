import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingCreateSchema } from "@/lib/validation";
import Stripe from "stripe";
import { Resend } from "resend";

/**
 * GET all bookings (for admin)
 */
export async function GET() {
  const list = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}

/**
 * Create booking; optionally send email and prepare Stripe Checkout session
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = BookingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data = parsed.data;

  const booking = await prisma.booking.create({
    data: {
      destination: data.destination,
      guests: data.guests,
      from: data.from,
      to: data.to,
      name: data.name,
      email: data.email,
      note: data.note,
      price: data.price,
      status: "pending",
    },
  });

  // Send email confirmation (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "TravelGo <noreply@travelgo.example>",
        to: booking.email,
        subject: "Xác nhận đặt chỗ",
        html: `<p>Chào ${booking.name},</p><p>Bạn đã đặt chỗ thành công. Mã đơn: <b>${booking.id}</b>.</p><p>Tổng: ${booking.price}. Trạng thái: ${booking.status}.</p>`,
      });
    } catch {
      // ignore email errors
    }
  }

  // Return booking; payment handled in /api/checkout/session
  return NextResponse.json(booking, { status: 201 });
}