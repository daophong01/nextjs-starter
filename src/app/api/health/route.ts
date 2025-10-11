import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Check database connectivity
  let db = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = true;
  } catch {
    db = false;
  }

  const email = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
  const stripe = Boolean(process.env.STRIPE_SECRET_KEY);
  const rateLimitUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  return NextResponse.json({
    ok: true,
    db,
    email,
    stripe,
    rateLimitUpstash,
    baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  });
}