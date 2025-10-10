"use client";

import { useEffect, useState } from "react";

type Props = {
  id: string; // unique id (destination slug or tour id)
  kind: "destination" | "tour";
};

function storageKey(kind: string) {
  return `travelx_wishlist_${kind}`;
}

export default function WishlistButton({ id, kind }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(kind));
    const set = new Set((raw ? JSON.parse(raw) : []) as string[]);
    setActive(set.has(id));
  }, [id, kind]);

  function toggle() {
    const key = storageKey(kind);
    const raw = localStorage.getItem(key);
    const list = (raw ? JSON.parse(raw) : []) as string[];
    const set = new Set(list);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
    setActive(set.has(id));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`text-xs h-8 px-3 rounded-full border transition-colors ${
        active
          ? "bg-pink-600 text-white border-pink-700"
          : "bg-white/70 dark:bg-white/10 border-black/10 dark:border-white/10 text-foreground/80"
      }`}
      aria-pressed={active}
    >
      {active ? "Đã thích" : "Yêu thích"}
    </button>
  );
}