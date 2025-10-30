"use client";
import { useEffect, useMemo, useState } from "react";

export default function HeroCarousel({
  images,
  ctaHref = "/destinations",
  ctaText = "Khám phá ngay",
}: {
  images: string[];
  ctaHref?: string;
  ctaText?: string;
}) {
  const [i, setI] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  // Parallax nhẹ theo scroll (tối đa 12px)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const o = Math.min(12, Math.max(0, y / 30));
      setOffset(o);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const style = useMemo(
    () => ({ transform: `translateY(-${offset}px)`, transition: "transform 120ms ease-out" }),
    [offset]
  );

  return (
    <div className="relative rounded-2xl overflow-hidden border border-black/[.08] dark:border-white/[.145] h-64 sm:h-80">
      <img
        src={images[i]}
        alt="Khung cảnh"
        className="h-full w-full object-cover transition-opacity duration-700"
        style={style}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
        <span className="text-sm/6">Gợi ý đặc biệt</span>
        <a href={ctaHref} className="rounded-full bg-white/90 text-black px-4 py-1 text-sm/6 hover:bg-white">
          {ctaText}
        </a>
      </div>
    </div>
  );
}