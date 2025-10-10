"use client";
import { useState } from "react";

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

const STATUS = ["pending", "paid", "cancelled"];

export default function AdminBookingsManager({ initialItems }: { initialItems: Booking[] }) {
  const [items, setItems] = useState<Booking[]>(initialItems);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Cập nhật trạng thái thất bại");
      }
      const updated = await res.json();
      setItems((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Xóa đơn thất bại");
      }
      setItems((prev) => prev.filter((b) => b.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="card p-4 animate-soft-pop">
      <h2 className="font-semibold">Danh sách đơn đặt chỗ</h2>
      {error && <p className="text-xs/6 text-red-600 mt-2">{error}</p>}
      <div className="mt-4 grid gap-3">
        {items.map((b) => (
          <div key={b.id} className="card p-3">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs/6">{b.id}</div>
              <span className="text-xs/6 rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145]">{b.status}</span>
            </div>
            <div className="text-sm/6 mt-2">
              <p>Điểm đến: {b.destination || "N/A"}</p>
              <p>Khách: {b.guests}</p>
              <p>Thời gian: {b.from || "-"} → {b.to || "-"}</p>
              <p>Tổng: ${b.price}</p>
              <p>Người đặt: {b.name} — {b.email}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium">Trạng thái</label>
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                  className="rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
                >
                  {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button className="btn" onClick={() => remove(b.id)}>Xóa</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="card p-4">Chưa có đơn đặt chỗ.</div>}
      </div>
    </div>
  );
}