"use client";
import { useEffect, useState } from "react";

export default function TopBannerCarousel() {
  const items = [
    { title: "Ưu đãi -10% tuần này", href: "/deals?off=10" },
    { title: "Mã SAVE15 cho đơn từ $150", href: "/deals?code=SAVE15" },
    { title: "Khám phá Tokyo – công nghệ hiện đại", href: "/destinations?slug=tokyo" },
  ];
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % items.length);
    }, 3500);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div
        className="h-20 sm:h-24 w-full"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--accent) 45%, transparent), color-mix(in oklab, var(--accent-2) 45%, transparent))",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold">
            TG
          </span>
          <div>
            <div className="text-sm sm:text-base font-semibold">TravelGo</div>
            <div className="text-xs/6 text-foreground/70">Khám phá dễ dàng, đặt chỗ nhanh chóng</div>
          </div>
        </div>
        <a href={items[i].href} className="btn btn-gradient">{items[i].title}</a>
      </div>
    </div>
  );
}