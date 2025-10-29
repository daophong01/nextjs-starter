import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Validate coupon and compute discount for a given order amount.
 * POST body: { code: string, amount: number }
 * Response: { valid: boolean, discount: number, description?: string }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = String((body as any)?.code || "").trim().toUpperCase();
  const amount = Number((body as any)?.amount || 0);
  if (!code || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid code/amount" }, { status: 400 });
  }

  const now = new Date();
  const c = await prisma.coupon.findUnique({ where: { code } }).catch(() => null);
  if (!c || !c.isActive || (c.validFrom && c.validFrom > now) || (c.validTo && c.validTo < now)) {
    return NextResponse.json({ valid: false, discount: 0 });
  }
  if (c.usageLimit && c.usedCount >= c.usageLimit) {
    return NextResponse.json({ valid: false, discount: 0 });
  }
  if (amount < c.minOrderAmount) {
    return NextResponse.json({ valid: false, discount: 0 });
  }

  let discount = 0;
  if ((c.discountType || "percentage") === "percentage") {
    discount = Math.floor((amount * c.discountValue) / 100);
  } else {
    discount = c.discountValue;
  }
  if (c.maxDiscountAmount) {
    discount = Math.min(discount, c.maxDiscountAmount);
  }
  discount = Math.max(0, Math.min(discount, amount));

  return NextResponse.json({ valid: true, discount, description: c.description || "" });
}