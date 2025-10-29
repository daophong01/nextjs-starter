"use client";
import { useState } from "react";

export default function CheckoutForm({
  destinationSlug,
  destinationName,
  basePrice,
  guests,
  from,
  to,
}: {
  destinationSlug?: string;
  destinationName?: string;
  basePrice: number;
  guests: number;
  from?: string;
  to?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  const serviceFee = 15;
  const subtotal = basePrice * guests;
  const total = Math.max(0, subtotal + serviceFee - discount);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyCoupon = async () => {
    setApplying(true);
    setError(null);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscount(data.discount || 0);
      } else {
        setDiscount(0);
        setError("Mã giảm giá không hợp lệ hoặc không áp dụng.");
      }
    } catch {
      setError("Không thể xác thực mã giảm giá.");
    } finally {
      setApplying(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destinationSlug,
          guests,
          from,
          to,
          name,
          email,
          note: notes,
          price: subtotal, // base only; server will add fee/tax and subtract discount
          couponCode: couponCode || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ id: data.id });
      } else {
        setError("Đặt chỗ thất bại. Vui lòng thử lại.");
      }
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const payStripe = async () => {
    if (!result?.id) return;
    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: result.id }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  return (
    <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr]">
      <section className="card p-4">
        <h2 className="font-semibold mb-2">Thông tin hành trình</h2>
        {destinationName ? (
          <div className="text-sm/6">
            <p>Điểm đến: <span className="font-semibold">{destinationName}</span></p>
            <p>Khách: <span className="font-semibold">{guests}</span></p>
            {from && <p>Ngày đi: <span className="font-semibold">{from}</span></p>}
            {to && <p>Ngày về: <span className="font-semibold">{to}</span></p>}
          </div>
        ) : (
          <p className="text-sm/6 text-foreground/70">Chưa chọn điểm đến.</p>
        )}

        <div className="mt-4 grid gap-3">
          <label className="text-xs font-medium">Tên người đặt</label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
          />

          <label className="text-xs font-medium">Email</label>
          <input
            type="email"
            placeholder="ban@vi.du.lich"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
          />

          <label className="text-xs font-medium">Ghi chú</label>
          <textarea
            placeholder="Yêu cầu đặc biệt..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent min-h-[80px]"
          />
        </div>
      </section>

      <aside className="card p-4 h-max">
        <h2 className="font-semibold mb-2">Thanh toán</h2>
        <div className="text-sm/6">
          <p>Giá cơ bản: ${basePrice} x {guests} khách</p>
          <p>Phí dịch vụ: $15</p>
          {discount > 0 && <p>Giảm giá: -${discount}</p>}
          <div className="mt-3 grid gap-2">
            <label className="text-xs font-medium">Mã giảm giá</label>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="VD: SAVE10"
                className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent flex-1"
              />
              <button className="btn disabled:opacity-70" onClick={applyCoupon} disabled={applying || !couponCode}>
                {applying ? "Đang áp dụng..." : "Áp dụng"}
              </button>
            </div>
          </div>
          <p className="font-semibold mt-2">Tổng: ${total}</p>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            className="btn btn-primary disabled:opacity-70"
            onClick={submit}
            disabled={submitting || !name || !email}
          >
            {submitting ? "Đang xử lý..." : "Lưu đặt chỗ"}
          </button>
          {result && (
            <button className="btn" onClick={payStripe}>
              Thanh toán Stripe
            </button>
          )}
        </div>
        {error && <p className="text-xs/6 text-red-600 mt-2">{error}</p>}
        {result && (
          <p className="text-xs/6 text-green-700 mt-2">
            Đặt chỗ đã lưu! Mã đơn: <span className="font-mono">{result.id}</span>
          </p>
        )}
        <p className="text-xs/6 text-foreground/60 mt-2">Thanh toán thực hiện qua Stripe (nếu cấu hình).</p>
      </aside>
    </div>
  );
}