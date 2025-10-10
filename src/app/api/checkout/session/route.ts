import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-09-30.acacia" });

  const { bookingId } = await request.json().catch(() => ({ bookingId: null }));
  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: booking.destination || "TravelGo Booking" },
          unit_amount: booking.price * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout?success=true&booking=${booking.id}`,
    cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout?cancelled=true&booking=${booking.id}`,
    metadata: { bookingId: booking.id },
  });

  return NextResponse.json({ id: session.id, url: session.url });
}