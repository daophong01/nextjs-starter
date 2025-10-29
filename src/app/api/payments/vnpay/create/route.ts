import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/payments/vnpay/create
 * Body: { bookingId: string }
 * Returns: { url }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const bookingId = String((body as any)?.bookingId || "");
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const tmnCode = process.env.VNPAY_TMN_CODE || "";
  const secret = process.env.VNPAY_HASH_SECRET || "";
  const endpoint = process.env.VNPAY_ENDPOINT || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = process.env.VNPAY_RETURN_URL || `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/payments/vnpay/callback`;

  if (!tmnCode || !secret) {
    return NextResponse.json({ error: "VNPay not configured" }, { status: 400 });
  }

  const amount = (booking.totalAmount || booking.price || 0) * 100; // in VND * 100
  const txnRef = booking.id;
  const now = new Date();
  const vnp_CreateDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  const ipAddr = "0.0.0.0";
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toan don ${booking.id}`,
    vnp_OrderType: "other",
    vnp_Amount: String(amount),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate,
  };

  // sort by key
  const sortedKeys = Object.keys(params).sort();
  const signData = sortedKeys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join("&");
  const vnp_SecureHash = crypto.createHmac("sha512", secret).update(signData).digest("hex");
  const url = `${endpoint}?${signData}&vnp_SecureHash=${vnp_SecureHash}`;

  // create pending transaction record
  await prisma.paymentTransaction.create({
    data: {
      bookingId: booking.id,
      userId: booking.userId || null,
      amount: booking.totalAmount || booking.price || 0,
      currency: "VND",
      paymentMethod: "vnpay",
      status: "pending",
    },
  });

  return NextResponse.json({ url });
}