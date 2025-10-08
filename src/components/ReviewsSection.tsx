"use client";
import { useEffect, useMemo, useState } from "react";
import type { Review } from "../data/reviews";
import { REVIEWS } from "../data/reviews";

export default function ReviewsSection({ slug }: { slug: string }) {
  const storageKey = `reviews:${slug}`;

  const [list, setList] = useState<Review[]>([]);

  // Load from localStorage or fallback to seed data
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Review[];
        setList(parsed);
      } else {
        setList(REVIEWS.filter((r) => r.slug === slug));
      }
    } catch {
      setList(REVIEWS.filter((r) => r.slug === slug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Persist to localStorage when list changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch {
      // ignore
    }
  }, [list, storageKey]);

  const avg = useMemo(() => {
    if (list.length === 0) return 0;
    return Number(
      (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(2)
    );
  }, [list]);

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `local-${Date.now()}`;
    const date = new Date().toISOString().slice(0, 10);
    const review: Review = { id, slug, author: author || "Khách ẩn danh", rating, comment, date };
    setList((prev) => [review, ...prev]);
    setAuthor("");
    setRating(5);
    setComment("");
  };

  return (
    <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-4">
      <h2 className="font-semibold">Đánh giá</h2>
      <p className="text-sm/6 text-foreground/70">Điểm trung bình: ⭐ {avg} ({list.length} đánh giá)</p>

      <ul className="mt-3 space-y-3">
        {list.map((r) => (
          <li key={r.id} className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3 bg-white dark:bg-black/40">
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.author}</span>
              <span className="text-sm/6">⭐ {r.rating}</span>
            </div>
            <p className="text-sm/6 mt-1">{r.comment}</p>
            <p className="text-xs/6 text-foreground/60 mt-1">{r.date}</p>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
            Chưa có đánh giá nào cho điểm đến này.
          </li>
        )}
      </ul>

      <form onSubmit={submit} className="mt-4 grid gap-3">
        <h3 className="font-semibold">Viết đánh giá</h3>
        <input
          type="text"
          placeholder="Tên của bạn"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium">Rating (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Ngày</label>
            <input
              type="date"
              value={new Date().toISOString().slice(0, 10)}
              readOnly
              className="w-full rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
            />
          </div>
        </div>
        <textarea
          placeholder="Cảm nhận của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent min-h-[80px]"
        />
        <button className="rounded-full bg-foreground text-background px-6 py-2 hover:opacity-90 w-max">Gửi đánh giá</button>
        <p className="text-xs/6 text-foreground/60">Đánh giá sẽ được lưu trong trình duyệt của bạn (localStorage, demo).</p>
      </form>
    </section>
  );
}