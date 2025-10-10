"use client";

import { useMemo, useState } from "react";
import TourCard from "@/components/TourCard";
import { tours } from "@/lib/data";

export const metadata = {
  title: "Tour | TravelX",
};

export default function ToursPage() {
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minDays, setMinDays] = useState<number | "">("");

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      if (maxPrice !== "" && t.price > Number(maxPrice)) return false;
      if (minDays !== "" && t.durationDays < Number(minDays)) return false;
      return true;
    });
  }, [maxPrice, minDays]);

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold">Tour nổi bật</h1>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-sm">Giá tối đa (USD)</label>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            placeholder="VD: 1000"
          />
        </div>
        <div>
          <label className="text-sm">Số ngày tối thiểu</label>
          <input
            type="number"
            min={1}
            value={minDays}
            onChange={(e) => setMinDays(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            placeholder="VD: 4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((t) => (
          <TourCard key={t.id} t={t} />
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-foreground/60">Không có tour phù hợp.</div>
        )}
      </div>
    </div>
  );
}