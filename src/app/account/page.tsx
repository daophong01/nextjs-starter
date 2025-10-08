"use client";

import { useEffect, useState } from "react";
import type { Booking } from "@/lib/db";
import { destinations, tours } from "@/lib/data";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchBookings(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Try to prefill from localStorage
    const last = localStorage.getItem("travelx_email");
    if (last) {
      setEmail(last);
      // do not auto-fetch to avoid unwanted network on first load
    }
  }, []);

  useEffect(() => {
    if (email) localStorage.setItem("travelx_email", email);
  }, [email]);

  return (
    <div className="mt-8 max-w-4xl">
      <h1 className="text-2xl font-semibold">Tài khoản</h1>
      <p className="text-sm text-foreground/70 mt-1">
        Tra cứu đơn đặt chỗ bằng email đã sử dụng khi gửi yêu cầu.
      </p>

      <form
        onSubmit={fetchBookings}
        className="mt-4 flex gap-2 items-center"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          className="flex-1 h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
          required
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-full bg-foreground text-background text-sm font-medium"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Xem đơn"}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {items.map((b) => {
          const dest = destinations.find((d) => d.slug === b.destination);
          const tour = tours.find((t) => t.id === b.tour);
          return (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">Mã đơn: {b.id}</div>
                <div className="text-xs text-foreground/60">
                  {new Date(b.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-foreground/80 mt-1">
                {b.fullName} • {b.email} • {b.travelers} người •{" "}
                {b.startDate ? `Khởi hành ${b.startDate}` : "Ngày linh hoạt"}
              </div>
              <div className="text-sm mt-1">
                {dest ? `Điểm đến: ${dest.name} (${dest.country})` : "Điểm đến: -"}
              </div>
              <div className="text-sm">
                {tour ? `Tour: ${tour.title} — $${tour.price}` : "Tour: -"}
              </div>
              {b.note && <div className="text-sm mt-1">Ghi chú: {b.note}</div>}
            </div>
          );
        })}
        {!loading && items.length === 0 && (
          <div className="text-sm text-foreground/60">Chưa có đơn nào.</div>
        )}
      </div>
    </div>
  );
}