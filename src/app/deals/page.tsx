import DestinationCard from "../../components/DestinationCard";
import { DESTINATIONS } from "../../data/destinations";
import Link from "next/link";

export default function DealsPage() {
  const baseDeals = DESTINATIONS.filter((d) => d.tags.includes("beach") || d.tags.includes("city"));
  const topCities = Array.from(new Set(baseDeals.map((d) => d.country))).slice(0, 6);

  return (
    <main className="container">
      <section className="mt-10 sm:mt-16 grid gap-6 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="relative rounded-2xl overflow-hidden">
            <div
              className="h-24 sm:h-28 w-full"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--accent) 45%, transparent), color-mix(in oklab, var(--accent-2) 45%, transparent))",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <div className="text-base sm:text-lg font-semibold">Ưu đãi -10% cho mùa này</div>
              <Link href="/destinations" className="btn btn-gradient">Khám phá ngay</Link>
            </div>
          </div>

          <p className="mt-3 text-sm/6 text-foreground/70">
            Tổng hợp các điểm đến có ưu đãi -10%. Giá hiển thị đã áp dụng khuyến mãi.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {baseDeals.map((d) => (
              <DestinationCard key={d.slug} d={d} />
            ))}
          </div>
          {baseDeals.length === 0 && (
            <div className="mt-6 card p-6">Hiện chưa có ưu đãi nào. Vui lòng quay lại sau.</div>
          )}
        </div>

        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Bộ lọc nhanh</h2>
          <div className="grid grid-cols-2 gap-2">
            {topCities.map((c) => (
              <Link key={c} href={`/destinations?country=${encodeURIComponent(c)}&tags=city`} className="btn">
                {c}
              </Link>
            ))}
          </div>
          <p className="text-xs/6 text-foreground/60 mt-2">
            Chọn quốc gia “city” để xem thêm ưu đãi liên quan.
          </p>
        </aside>
      </section>
    </main>
  );
}