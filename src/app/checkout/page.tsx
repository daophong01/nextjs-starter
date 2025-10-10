"use client";
import { DESTINATIONS } from "../../data/destinations";
import { useState } from "react";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams?: { destination?: string; guests?: string; from?: string; to?: string };
}) {
  const d = DESTINATIONS.find((x) => x.slug === (searchParams?.destination || ""));
  const guests = Math.max(1, Number(searchParams?.guests || 2));
  const price = d ? d.price * guests : 0;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: d?.slug,
          guests,
          from: searchParams?.from,
          to: searchParams?.to,
          name,
          email,
          note: notes,
          price: price + 15,
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
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Xác nhận đặt chỗ</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <section className="card p-4">
          <h2 className="font-semibold mb-2">Thông tin hành trình</h2>
          {d ? (
            <div className="text-sm/6">
              <p>Điểm đến: <span className="font-semibold">{d.name}</span></p>
              <p>Khách: <span className="font-semibold">{guests}</span></p>
              {searchParams?.from && <p>Ngày đi: <span className="font-semibold">{searchParams.from}</span></p>}
              {searchParams?.to && <p>Ngày về: <span className="font-semibold">{searchParams.to}</span></p>}
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
            <p>Giá cơ bản: ${d?.price ?? 0} x {guests} khách</p>
            <p>Phí dịch vụ: $15</p>
            <p className="font-semibold mt-2">Tổng: ${price + 15}</p>
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
    </main>
  );
}