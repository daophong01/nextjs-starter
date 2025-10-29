"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PaginationBar({ total, pageSize }: { total: number; pageSize: number }) {
  const sp = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(sp.get("page") || 1));
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const [goto, setGoto] = useState("");

  const go = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(Math.min(Math.max(1, p), pages)));
    router.push(`/destinations?${params.toString()}`);
  };

  if (pages <= 1) return null;

  const items = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) items.push(i);

  const submitGoto = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number(goto);
    if (!Number.isNaN(p)) go(p);
  };

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <span className="text-xs/6 text-foreground/70">Trang {page}/{pages}</span>
      <button
        className="rounded-full border border-black/[.08] dark:border-white/[.145] px-3 py-1 disabled:opacity-50"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
      >
        ← Trước
      </button>
      {start > 1 && (
        <>
          <button className="rounded-full px-3 py-1 underline" onClick={() => go(1)}>1</button>
          <span className="px-1">…</span>
        </>
      )}
      {items.map((i) => (
        <button
          key={i}
          onClick={() => go(i)}
          className={`rounded-full px-3 py-1 border ${
            i === page ? "bg-foreground text-background border-transparent" : "border-black/[.08] dark:border-white/[.145]"
          }`}
        >
          {i}
        </button>
      ))}
      {end < pages && (
        <>
          <span className="px-1">…</span>
          <button className="rounded-full px-3 py-1 underline" onClick={() => go(pages)}>{pages}</button>
        </>
      )}
      <button
        className="rounded-full border border-black/[.08] dark:border-white/[.145] px-3 py-1 disabled:opacity-50"
        onClick={() => go(page + 1)}
        disabled={page >= pages}
      >
        Sau →
      </button>
      <form onSubmit={submitGoto} className="ml-2 flex items-center gap-1">
        <input
          type="number"
          min={1}
          max={pages}
          value={goto}
          onChange={(e) => setGoto(e.target.value)}
          placeholder="Đi tới..."
          className="w-20 rounded border border-black/[.08] dark:border-white/[.145] px-2 py-1 bg-transparent text-sm"
        />
        <button className="rounded-full border border-black/[.08] dark:border-white/[.145] px-3 py-1 text-sm">Go</button>
      </form>
    </nav>
  );
}