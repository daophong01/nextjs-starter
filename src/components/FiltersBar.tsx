"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DESTINATIONS } from "../data/destinations";

export default function FiltersBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const countries = useMemo(
    () => Array.from(new Set(DESTINATIONS.map((d) => d.country))).sort(),
    []
  );
  const tags = useMemo(
    () => Array.from(new Set(DESTINATIONS.flatMap((d) => d.tags))).sort(),
    []
  );

  const pushParams = (params: URLSearchParams) => {
    // Reset về trang 1 khi thay đổi filter
    params.set("page", "1");
    router.push(`/destinations?${params.toString()}`);
  };

  const update = (key: string, value?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    pushParams(params);
  };

  const selectedTags = (sp.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(sp.toString());
    const set = new Set(selectedTags);
    if (set.has(tag)) {
      set.delete(tag);
    } else {
      set.add(tag);
    }
    const value = Array.from(set).join(",");
    if (value) params.set("tags", value);
    else params.delete("tags");
    pushParams(params);
  };

  return (
    <div className="mt-4 rounded-xl border border-black/[.08] dark:border-white/[.145] p-4 bg-white dark:bg-black/40 grid gap-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium">Quốc gia</label>
          <select
            value={sp.get("country") || ""}
            onChange={(e) => update("country", e.target.value || undefined)}
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
          >
            <option value="">Tất cả</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium">Giá từ</label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={sp.get("priceMin") || ""}
            onChange={(e) => update("priceMin", e.target.value || undefined)}
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium">Giá đến</label>
          <input
            type="number"
            min={0}
            placeholder="500"
            value={sp.get("priceMax") || ""}
            onChange={(e) => update("priceMax", e.target.value || undefined)}
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium">Rating tối thiểu</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            placeholder="4.5"
            value={sp.get("ratingMin") || ""}
            onChange={(e) => update("ratingMin", e.target.value || undefined)}
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Tags (chọn nhiều)</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => {
            const active = selectedTags.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={`text-sm/6 rounded-full px-3 py-1 border transition ${
                  active
                    ? "bg-foreground text-background border-transparent"
                    : "border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                }`}
                aria-pressed={active}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}