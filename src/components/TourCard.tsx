import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/lib/data";

export default function TourCard({ t }: { t: Tour }) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/10]">
        <Image
          src={t.image}
          alt={t.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {t.durationDays} ngày
        </div>
      </div>
      <div className="p-4">
        <div className="font-semibold">{t.title}</div>
        <div className="mt-1 text-sm text-foreground/70">Từ ${t.price}</div>
        <div className="mt-2 text-sm line-clamp-2">{t.summary}</div>
        <div className="mt-3 flex justify-between items-center">
          <Link
            href={`/destinations/${t.destinationSlug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Xem điểm đến
          </Link>
          <Link
            href={`/book?tour=${t.id}`}
            className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Đặt ngay
          </Link>
        </div>
      </div>
    </div>
  );
}