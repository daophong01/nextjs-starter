import { NextResponse } from "next/server";
import { readJson, writeJson } from "../../../lib/store";

type Booking = {
  id: string;
  destination?: string;
  guests: number;
  from?: string;
  to?: string;
  name: string;
  email: string;
  note?: string;
  price: number;
  createdAt: string;
};

const FILENAME = "bookings.json";

export async function GET() {
  const list = await readJson<Booking[]>(FILENAME, []);
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { destination, guests, from, to, name, email, note, price } = body as Partial<Booking>;
  if (!name || !email || !guests || typeof price !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const booking: Booking = {
    id: `bk-${Date.now()}`,
    destination,
    guests: Number(guests),
    from,
    to,
    name,
    email,
    note,
    price,
    createdAt: new Date().toISOString(),
  };

  const list = await readJson<Booking[]>(FILENAME, []);
  list.unshift(booking);
  await writeJson(FILENAME, list);

  return NextResponse.json(booking, { status: 201 });
}