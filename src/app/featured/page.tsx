import DestinationCard from "@/components/DestinationCard";
import { DESTINATIONS } from "@/data/destinations";
import Link from "next/link";

export const metadata = {
  title: "Điểm đến nổi bật - TravelGo",
  description: "Top điểm đến được yêu thích, đánh giá cao.",
};

export default function FeaturedPage() {
  const featured = DESTINATIONS
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);

  const topCountries = Array.from(new Set(DESTINATIONS.map((d) => d.country))).slice(0, 6);

  return (
    <main className="container">
      <section className="mt-8 grid gap-6 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <h1 className="text-2xl font-bold">Điểm đến nổi bật</h1>
          <p className="text-sm/6 text-foreground/70 mt-1">
            Top điểm đến được yêu thích bởi khách hàng (xếp theo rating).
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <DestinationCard key={d.slug} d={d} />
            ))}
          </div>
        </div>

        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Khám phá theo quốc gia</h2>
          <div className="grid grid-cols-2 gap-2">
            {topCountries.map((c) => (
              <Link key={c} href={`/destinations?country=${encodeURIComponent(c)}`} className="btn">
                {c}
              </Link>
            ))}
          </div>
          <p className="text-xs/6 text-foreground/60 mt-2">
            Chọn quốc gia để lọc danh sách điểm đến phù hợp.
          </p>
        </aside>
      </section>
    </main>
  );
}