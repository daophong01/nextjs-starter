import Image from "next/image";
import Link from "next/link";
import { destinations, tours } from "@/lib/data";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default function DestinationDetail({
  params,
}: {
  params: { slug: string };
}) {
  const dest = destinations.find((d) => d.slug === params.slug);
  if (!dest) {
    return <div className="mt-8">Không tìm thấy điểm đến.</div>;
  }
  const relatedTours = tours.filter((t) => t.destinationSlug === dest.slug);

  return (
    <div className="mt-6">
      <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 p-6 sm:p-10 text-white">
          <div className="text-sm text-white/80">{dest.country}</div>
          <h1 className="text-3xl sm:text-5xl font-bold">{dest.name}</h1>
          <div className="mt-2 text-white/90 max-w-3xl">{dest.description}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {dest.highlights.map((h) => (
              <span key={h} className="text-xs px-2 py-1 rounded-full bg-white/20">
                {h}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href={`/book?destination=${dest.slug}`}
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-black text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Đặt ngay từ ${dest.priceFrom}
            </Link>
          </div>
        </div>
      </div>

      {relatedTours.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Tour liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {relatedTours.map((t) => (
              <Link
                key={t.id}
                href={`/book?tour=${t.id}`}
                className="p-4 rounded-2xl border border-black/5 dark:border-white/10 hover:shadow-md transition-shadow bg-white/60 dark:bg-white/5"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <Image src={t.image} alt={t.title} fill className="object-cover" />
                </div>
                <div className="mt-3 font-medium">{t.title}</div>
                <div className="text-sm text-foreground/70">
                  {t.durationDays} ngày • ${t.price}
                </div>
                <div className="text-sm mt-1 line-clamp-2">{t.summary}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}