"use client";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  destination?: string;
  guests: number;
  from?: string;
  to?: string;
  name: string;
  email: string;
  note?: string;
  price: number;
  status: string;
  createdAt: string;
};

type Review = {
  id: string;
  slug: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()),
    ])
      .then(([bks, rvs]) => {
        setBookings(bks);
        setReviews(rvs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Bảng điều khiển (Admin)</h1>
      <p className="text-sm/6 text-foreground/70">Xem nhanh đơn đặt chỗ và đánh giá gần đây.</p>

      {loading ? (
        <div className="mt-6 card p-6">Đang tải dữ liệu...</div>
      ) : (
        <>
          <section className="mt-6">
            <h2 className="font-semibold mb-2">Đơn đặt chỗ</h2>
            <div className="grid gap-3">
              {bookings.map((b) => (
                <div key={b.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm/6">{b.id}</div>
                    <span className="text-xs/6 rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145]">{b.status}</span>
                  </div>
                  <div className="text-sm/6 mt-2">
                    <p>Điểm đến: {b.destination || "N/A"}</p>
                    <p>Khách: {b.guests}</p>
                    <p>Thời gian: {b.from || "-"} → {b.to || "-"}</p>
                    <p>Tổng: ${b.price}</p>
                    <p>Người đặt: {b.name} — {b.email}</p>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <div className="card p-4">Chưa có đơn đặt chỗ.</div>}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="font-semibold mb-2">Đánh giá gần đây</h2>
            <div className="grid gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm/6">{r.slug}</div>
                    <span className="text-sm/6">⭐ {r.rating}</span>
                  </div>
                  <p className="text-sm/6 mt-2">{r.comment}</p>
                  <p className="text-xs/6 text-foreground/60 mt-1">{r.author} — {r.date}</p>
                </div>
              ))}
              {reviews.length === 0 && <div className="card p-4">Chưa có đánh giá.</div>}
            </div>
          </section>
        </>
      )}
    </main>
  );
}