import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { auth as authConfig } from "@/lib/server-auth";
import { tours } from "@/lib/data";
import { sendBookingEmail } from "@/lib/sendMail";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  const where = email ? { email: { equals: email, mode: "insensitive" } } : {};
  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: bookings });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { fullName, email, travelers, startDate, destination, tour, note } = body || {};
  if (!fullName || !email) {
    return NextResponse.json({ error: "Missing fullName or email" }, { status: 400 });
  }

  // Compute amount by selected tour
  let amount = 0;
  if (tour) {
    const t = tours.find((x) => x.id === tour);
    if (t) amount = Math.round(Number(t.price) * 100); // cents
  }

  const booking = await prisma.booking.create({
    data: {
      fullName,
      email,
      travelers: Number(travelers || 1),
      startDate: startDate || "",
      destination: destination || null,
      tour: tour || null,
      note: note || "",
      userId: session?.user?.id || null,
      amount,
      currency: "usd",
      status: "PENDING",
    },
  });

  // Try sending confirmation email (non-blocking)
  sendBookingEmail(booking).catch(() => {});

  return NextResponse.json({ data: booking }, { status: 201 });
}