import { NextResponse } from "next/server";

// Registration is disabled
export async function POST() {
  return NextResponse.json({ error: "Registration disabled" }, { status: 403 });
}