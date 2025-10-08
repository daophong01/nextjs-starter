import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const { bookingId } = (body || {}) as { bookingId?: string };
  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const amount = booking.amount || 0;
  if (amount <= 0) {
    return NextResponse.json({ error: "Invalid booking amount" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: booking.currency || "usd",
          product_data: {
            name: "TravelX Booking",
            description: booking.tour
              ? `Tour ${booking.tour} • ${booking.travelers} người`
              : `Đặt chỗ • ${booking.travelers} người`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/account?paid=1`,
    cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/account?cancel=1`,
    metadata: {
      bookingId: booking.id,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { paymentId: session.id },
  });

  return NextResponse.json({ url: session.url });
}