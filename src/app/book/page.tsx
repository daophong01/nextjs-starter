"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { destinations, tours } from "@/lib/data";

export default function BookPage() {
  const params = useSearchParams();
  const destinationSlug = params.get("destination") || "";
  const tourId = params.get("tour") || "";

  const preselectTour = useMemo(
    () => tours.find((t) => t.id === tourId),
    [tourId]
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    travelers: 2,
    startDate: "",
    destination: destinationSlug || preselectTour?.destinationSlug || "",
    tour: tourId || "",
    note: "",
  });

  const availableTours = useMemo(() => {
    if (!form.destination) return tours;
    return tours.filter((t) => t.destinationSlug === form.destination);
  }, [form.destination]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, call an API route. For now, just log.
    console.log("Booking request:", form);
    alert("Đã gửi yêu cầu đặt chỗ! Chúng tôi sẽ liên hệ sớm.");
  }

  return (
    <div className="mt-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">Đặt chỗ</h1>
      <p className="text-sm text-foreground/70 mt-1">
        Điền thông tin của bạn để đặt tour hoặc yêu cầu tư vấn.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Họ và tên</label>
            <input
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
              className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
              placeholder="ban@vidu.com"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Số người</label>
            <input
              type="number"
              min={1}
              value={form.travelers}
              onChange={(e) => update("travelers", Number(e.target.value))}
              className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ngày khởi hành</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Điểm đến</label>
            <select
              value={form.destination}
              onChange={(e) => update("destination", e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            >
              <option value="">Chọn điểm đến</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} — {d.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Chọn tour (tuỳ chọn)</label>
          <select
            value={form.tour}
            onChange={(e) => update("tour", e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
          >
            <option value="">Không chọn</option>
            {availableTours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} — ${t.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Ghi chú</label>
          <textarea
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            rows={4}
            className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            placeholder="Yêu cầu riêng, lịch trình mong muốn..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Gửi yêu cầu
          </button>
        </div>
      </form>
    </div>
  );
}