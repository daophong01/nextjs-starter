import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingCreateSchema } from "@/lib/validation";
import { Resend } from "resend";
import { rateLimitOrThrow, keyFromRequest } from "@/lib/rateLimit";
import { assertNotRateLimited, keyFromRequest as keyUpstash } from "@/lib/rateLimitUpstash";
import { render } from "@react-email/render";
import BookingConfirmationEmail from "@/emails/BookingConfirmation";

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
 * Create booking; optionally send email
 */
export async function POST(request: Request) {
  // Prefer Upstash limiter if configured, else local limiter
  try {
    await assertNotRateLimited(keyUpstash(request));
  } catch {
    try {
      rateLimitOrThrow(keyFromRequest(request));
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: err.status || 429 });
    }
  }

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
      const emailHtml = render(
        BookingConfirmationEmail({
          name: booking.name,
          id: booking.id,
          destination: booking.destination || undefined,
          guests: booking.guests,
          from: booking.from || undefined,
          to: booking.to || undefined,
          price: booking.price,
          status: booking.status,
        })
      );
      await resend.emails.send({
        from: process.env.RESEND_FROM || "TravelGo <noreply@travelgo.example>",
        to: booking.email,
        subject: "Xác nhận đặt chỗ",
        html: emailHtml,
      });
    } catch {
      // ignore email errors
    }
  }

  // Return booking; payment handled in /api/checkout/session
  return NextResponse.json(booking, { status: 201 });
}