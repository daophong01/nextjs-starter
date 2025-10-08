"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    router.push(`/destinations?search=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-2xl mx-auto bg-white/70 dark:bg-black/30 backdrop-blur border border-black/10 dark:border-white/10 rounded-full p-2 flex items-center gap-2"
    >
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm thành phố, quốc gia, điểm đến..."
        className="flex-1 bg-transparent outline-none px-4 text-sm placeholder:text-foreground/50"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Tìm kiếm
      </button>
    </form>
  );
}