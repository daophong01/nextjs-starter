import { NextRequest, NextResponse } from "next/server";
import { addBooking, readBookings } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  const bookings = await readBookings();
  const data = email ? bookings.filter((b) => b.email.toLowerCase() === email) : bookings;
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { fullName, email, travelers, startDate, destination, tour, note } = body || {};
  if (!fullName || !email) {
    return NextResponse.json({ error: "Missing fullName or email" }, { status: 400 });
  }
  const booking = await addBooking({
    fullName,
    email,
    travelers: Number(travelers || 1),
    startDate: startDate || "",
    destination: destination || undefined,
    tour: tour || undefined,
    note: note || "",
  });
  return NextResponse.json({ data: booking }, { status: 201 });
}