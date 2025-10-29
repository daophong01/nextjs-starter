import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { render } from "@react-email/render";
import ReceiptEmail from "@/emails/ReceiptEmail";
import InvoiceEmail from "@/emails/InvoiceEmail";
import { sendEmail } from "@/lib/mailer";

/**
 * MoMo callback/IPN.
 * Verifies signature and updates booking/transaction.
 */
export async function POST(request: Request) {
  const partnerCode = process.env.MOMO_PARTNER_CODE || "";
  const accessKey = process.env.MOMO_ACCESS_KEY || "";
  const secretKey = process.env.MOMO_SECRET_KEY || "";
  if (!partnerCode || !accessKey || !secretKey) {
    return NextResponse.json({ error: "MoMo not configured" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const {
    amount,
    orderId,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature: sig,
  } = body;

  // Rebuild signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData || ""}&message=${message || ""}&orderId=${orderId}&orderInfo=${orderInfo || ""}&orderType=${orderType || ""}&partnerCode=${partnerCode}&payType=${payType || ""}&responseTime=${responseTime || ""}&resultCode=${resultCode}&transId=${transId || ""}`;
  const expected = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
  const okSig = sig && sig === expected;
  const paid = okSig && Number(resultCode) === 0;

  let booking: any = null;
  if (orderId) {
    booking = await prisma.booking.update({
      where: { id: orderId },
      data: {
        status: paid ? "paid" : "pending",
        paymentMethod: "momo",
      },
    });

    const lastTx = await prisma.paymentTransaction.findFirst({
      where: { bookingId: orderId, paymentMethod: "momo" },
      orderBy: { createdAt: "desc" },
    });
    if (lastTx) {
      await prisma.paymentTransaction.update({
        where: { id: lastTx.id },
        data: {
          status: paid ? "paid" : "failed",
          gatewayTransactionId: transId ? String(transId) : null,
          gatewayResponse: JSON.stringify(body),
          failureReason: paid ? null : `resultCode=${resultCode}`,
          updatedAt: new Date(),
        },
      });
    }
  }

  if (paid && booking) {
    const subtotal = booking.price;
    const discount = booking.discountAmount || 0;
    const serviceFee = booking.serviceFee || 0;
    const tax = booking.tax || 0;
    const total = booking.totalAmount || booking.price;

    const invoiceHtml = render(
      InvoiceEmail({
        bookingId: booking.id,
        name: booking.name,
        destination: booking.destination || undefined,
        guests: booking.guests,
        from: booking.from || undefined,
        to: booking.to || undefined,
        subtotal,
        discount,
        serviceFee,
        tax,
        total,
        createdAt: booking.createdAt?.toISOString(),
      })
    );

    const receiptHtml = render(
      ReceiptEmail({
        bookingId: booking.id,
        name: booking.name,
        total,
        paymentMethod: "MoMo",
        paidAt: new Date().toISOString(),
      })
    );

    await sendEmail({
      to: booking.email,
      subject: `Hóa đơn đặt chỗ #${booking.id}`,
      html: invoiceHtml,
    });
    await sendEmail({
      to: booking.email,
      subject: `Biên nhận thanh toán #${booking.id}`,
      html: receiptHtml,
    });
  }

  // MoMo expects a JSON response
  return NextResponse.json({ resultCode: 0, message: "OK" });
}