import { NextResponse } from "next/server";
import { DESTINATIONS } from "../../../../data/destinations";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const d = DESTINATIONS.find((x) => x.slug === params.slug);
  if (!d) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(d);
}