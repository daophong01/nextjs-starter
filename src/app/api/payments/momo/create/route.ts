import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/payments/momo/create
 * Body: { bookingId: string }
 * Returns: { payUrl }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const bookingId = String((body as any)?.bookingId || "");
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const partnerCode = process.env.MOMO_PARTNER_CODE || "";
  const accessKey = process.env.MOMO_ACCESS_KEY || "";
  const secretKey = process.env.MOMO_SECRET_KEY || "";
  const endpoint = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
  const returnUrl = process.env.MOMO_RETURN_URL || `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/payments/momo/callback`;
  const ipnUrl = process.env.MOMO_IPN_URL || returnUrl;

  if (!partnerCode || !accessKey || !secretKey) {
    return NextResponse.json({ error: "MoMo not configured" }, { status: 400 });
  }

  const amount = (booking.totalAmount || booking.price || 0);
  const orderId = booking.id;
  const requestId = `${booking.id}-${Date.now()}`;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=Thanh toan don ${booking.id}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;
  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  const payload = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo: `Thanh toan don ${booking.id}`,
    redirectUrl: returnUrl,
    ipnUrl,
    requestType: "captureWallet",
    signature,
    lang: "vi",
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.payUrl) {
    return NextResponse.json({ error: data?.message || "MoMo create failed" }, { status: 400 });
  }

  await prisma.paymentTransaction.create({
    data: {
      bookingId: booking.id,
      userId: booking.userId || null,
      amount,
      currency: "VND",
      paymentMethod: "momo",
      status: "pending",
      gatewayTransactionId: data.transId ? String(data.transId) : null,
      gatewayResponse: JSON.stringify(data),
    },
  });

  return NextResponse.json({ payUrl: data.payUrl });
}