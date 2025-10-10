import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingCreateSchema } from "@/lib/validation";
import { Resend } from "resend";
import { rateLimitOrThrow, keyFromRequest } from "@/lib/rateLimit";
import { assertNotRateLimited, keyFromRequest as keyUpstash } from "@/lib/rateLimitUpstash";

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
      const html = `
        <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #171717;">
          <h2 style="margin:0 0 8px 0;">Xác nhận đặt chỗ</h2>
          <p style="margin:0 0 12px 0;">Chào ${booking.name},</p>
          <p style="margin:0 0 8px 0;">
            Bạn đã đặt chỗ thành công. Mã đơn: <b>${booking.id}</b>.
          </p>
          <table style="margin-top:8px; border-collapse: collapse;">
            <tr><td style="padding:4px 8px;">Điểm đến</td><td style="padding:4px 8px;"><b>${booking.destination || "N/A"}</b></td></tr>
            <tr><td style="padding:4px 8px;">Khách</td><td style="padding:4px 8px;"><b>${booking.guests}</b></td></tr>
            <tr><td style="padding:4px 8px;">Thời gian</td><td style="padding:4px 8px;">${booking.from || "-"} → ${booking.to || "-"}</td></tr>
            <tr><td style="padding:4px 8px;">Tổng</td><td style="padding:4px 8px;"><b>${booking.price}</b></td></tr>
            <tr><td style="padding:4px 8px;">Trạng thái</td><td style="padding:4px 8px;">${booking.status}</td></tr>
          </table>
          <p style="margin-top:12px;">Cảm ơn bạn đã tin tưởng TravelGo!</p>
        </div>
      `;
      await resend.emails.send({
        from: "TravelGo <noreply@travelgo.example>",
        to: booking.email,
        subject: "Xác nhận đặt chỗ",
        html,
      });
    } catch {
      // ignore email errors
    }
  }

  // Return booking; payment handled in /api/checkout/session
  return NextResponse.json(booking, { status: 201 });
}