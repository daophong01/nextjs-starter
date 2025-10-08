import Image from "next/image";
import Link from "next/link";
import type { Destination } from "../data/destinations";

export default function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link href={`/destinations/${d.slug}`} className="group rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black/40">
      <div className="relative h-48 w-full">
        <Image
          src={d.image}
          alt={d.name}
          fill
          className="object-cover transition-transform group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{d.name}</h3>
          <span className="text-sm/6 rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145]">⭐ {d.rating}</span>
        </div>
        <p className="text-sm/6 text-foreground/70 line-clamp-2 mt-1">{d.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-sm/6">Từ ${d.price}</span>
          <span className="text-sm/6 underline">Xem chi tiết →</span>
        </div>
      </div>
    </Link>
  );
}