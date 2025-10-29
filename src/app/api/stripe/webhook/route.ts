import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import ReceiptEmail from "@/emails/ReceiptEmail";
import InvoiceEmail from "@/emails/InvoiceEmail";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-09-30.acacia" });
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig || "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "paid", paymentMethod: "stripe" },
      });

      // Update transaction to paid
      const tx = await prisma.paymentTransaction.findFirst({
        where: { bookingId, paymentMethod: "stripe" },
        orderBy: { createdAt: "desc" },
      });
      if (tx) {
        await prisma.paymentTransaction.update({
          where: { id: tx.id },
          data: {
            status: "paid",
            gatewayTransactionId: session.id,
            updatedAt: new Date(),
          },
        });
      }

      // Send invoice and receipt emails
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
          paymentMethod: "Stripe",
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
  }

  return NextResponse.json({ received: true });
}