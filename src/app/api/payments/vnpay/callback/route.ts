import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * GET /api/payments/vnpay/callback?...VNPay params...
 * Verifies hash and updates booking/payment transaction.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const secret = process.env.VNPAY_HASH_SECRET || "";
  if (!secret) return NextResponse.json({ error: "VNPay not configured" }, { status: 400 });

  // Extract hash
  const secureHash = params["vnp_SecureHash"] || "";
  // Prepare data string without hash
  const filtered: Record<string, string> = {};
  Object.keys(params)
    .filter((k) => k !== "vnp_SecureHash" && k !== "vnp_SecureHashType")
    .sort()
    .forEach((k) => {
      filtered[k] = params[k];
    });
  const signData = Object.keys(filtered).map((k) => `${k}=${encodeURIComponent(filtered[k])}`).join("&");
  const checkHash = crypto.createHmac("sha512", secret).update(signData).digest("hex");

  const txnRef = params["vnp_TxnRef"];
  const rspCode = params["vnp_ResponseCode"];

  const okHash = secureHash && secureHash.toLowerCase() === checkHash.toLowerCase();
  const paid = okHash && rspCode === "00";

  // Update booking and transaction
  if (txnRef) {
    // Update booking
    await prisma.booking.update({
      where: { id: txnRef },
      data: {
        status: paid ? "paid" : "pending",
        paymentMethod: "vnpay",
      },
    });

    // Update transaction
    const lastTx = await prisma.paymentTransaction.findFirst({
      where: { bookingId: txnRef, paymentMethod: "vnpay" },
      orderBy: { createdAt: "desc" },
    });
    if (lastTx) {
      await prisma.paymentTransaction.update({
        where: { id: lastTx.id },
        data: {
          status: paid ? "paid" : "failed",
          gatewayTransactionId: params["vnp_TransactionNo"] || null,
          gatewayResponse: JSON.stringify(params),
          failureReason: paid ? null : `rspCode=${rspCode}`,
          updatedAt: new Date(),
        },
      });
    }
  }

  // Simple HTML response
  const body = paid
    ? `<h3>Thanh toán thành công</h3><p>Mã đơn: ${txnRef}</p>`
    : `<h3>Thanh toán chưa thành công</h3><p>Mã đơn: ${txnRef}</p><p>Mã phản hồi: ${rspCode}</p>`;

  return new NextResponse(body, { headers: { "Content-Type": "text/html" } });
}