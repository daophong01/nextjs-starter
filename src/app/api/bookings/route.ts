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

  // Coupon validation if provided
  let couponCode: string | undefined = undefined;
  let discountAmount = 0;
  const serviceFee = 15;
  const tax = 0;

  if (typeof (data as any).couponCode === "string") {
    couponCode = String((data as any).couponCode || "").trim().toUpperCase();
    if (couponCode) {
      const c = await prisma.coupon.findUnique({ where: { code: couponCode } }).catch(() => null);
      if (c && c.isActive) {
        // basic validation; detailed checks happen in /api/coupons
        const base = data.price;
        if (base >= (c.minOrderAmount || 0)) {
          discountAmount =
            (c.discountType || "percentage") === "percentage"
              ? Math.floor((base * c.discountValue) / 100)
              : c.discountValue;
          if (c.maxDiscountAmount) discountAmount = Math.min(discountAmount, c.maxDiscountAmount);
          discountAmount = Math.max(0, Math.min(discountAmount, base));
          // Update usedCount soft (no concurrency safe guarantee here)
          await prisma.coupon.update({
            where: { code: couponCode },
            data: { usedCount: (c.usedCount || 0) + 1 },
          });
        }
      }
    }
  }

  const totalAmount = Math.max(0, data.price + serviceFee + tax - discountAmount);

  const booking = await prisma.booking.create({
    data: {
      destination: data.destination,
      tourSlug: (data as any).tour || undefined,
      tourName: (data as any).tourName || undefined,
      guests: data.guests,
      from: data.from,
      to: data.to,
      name: data.name,
      email: data.email,
      note: data.note,
      price: data.price,
      status: "pending",
      couponCode,
      discountAmount,
      totalAmount,
      serviceFee,
      tax,
    },
  });

  // Send email confirmation (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const destinationText = booking.tourName || booking.destination || undefined;
      const emailHtml = render(
        BookingConfirmationEmail({
          name: booking.name,
          id: booking.id,
          destination: destinationText,
          guests: booking.guests,
          from: booking.from || undefined,
          to: booking.to || undefined,
          price: booking.totalAmount || booking.price,
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