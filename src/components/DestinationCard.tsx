import Image from "next/image";
import Link from "next/link";
import type { Destination } from "../data/destinations";
import { StarIcon, MapPinIcon } from "@heroicons/react/24/solid";

export default function DestinationCard({ d }: { d: Destination }) {
  const isDeal = d.tags.includes("beach") || d.tags.includes("city");
  const dealPrice = isDeal ? Math.max(0, Math.round(d.price * 0.9)) : d.price;

  return (
    <Link href={`/destinations/${d.slug}`} className="group card overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={d.image}
          alt={d.name}
          fill
          className="object-cover transition-transform group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {isDeal && (
          <span className="absolute top-3 left-3 text-xs/6 px-2 py-1 rounded-full bg-foreground/90 text-background">
            -10% ưu đãi
          </span>
        )}
        <span className="absolute top-3 right-3 text-xs/6 px-2 py-1 rounded-full border border-black/[.08] dark:border-white/[.145] bg-background/80">
          {d.country}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-foreground/70" aria-hidden="true" />
            {d.name}
          </h3>
          <span className="text-sm/6 rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145] flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-500" aria-hidden="true" />
            {d.rating}
          </span>
        </div>
        <p className="text-sm/6 text-foreground/70 line-clamp-2 mt-1">{d.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-sm/6">
            Từ ${dealPrice}
            {isDeal && <span className="ml-2 line-through opacity-60">${d.price}</span>}
          </span>
          <span className="text-sm/6 underline">Xem chi tiết →</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-xs/6 px-2 py-1 rounded-full border border-black/[.08] dark:border-white/[.145]">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}