import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/data";

export default function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link
      href={`/destinations/${d.slug}`}
      className="group rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 hover:shadow-lg transition-shadow bg-white/60 dark:bg-white/5"
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={d.image}
          alt={d.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {d.rating.toFixed(1)} ★
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{d.name}</div>
          <div className="text-sm text-foreground/70">{d.country}</div>
        </div>
        <div className="mt-1 text-sm text-foreground/70">Từ ${d.priceFrom}</div>
        <div className="mt-2 text-sm line-clamp-2">{d.description}</div>
      </div>
    </Link>
  );
}