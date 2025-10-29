import DestinationCard from "../../components/DestinationCard";
import { DESTINATIONS } from "../../data/destinations";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

/**
 * Deals page supports:
 * - Percentage off via ?off=10|15|20
 * - Coupon via ?code=SAVE10 (reads from DB Coupon if active)
 */
export default async function DealsPage({ searchParams }: { searchParams?: { off?: string; code?: string } }) {
  // Base dataset
  const baseDeals = DESTINATIONS.filter((d) => d.tags.includes("beach") || d.tags.includes("city"));
  const topCities = Array.from(new Set(baseDeals.map((d) => d.country))).slice(0, 6);

  // Try coupon code from DB
  let off = Math.min(20, Math.max(10, Number(searchParams?.off || 0))) || 0;
  let code = (searchParams?.code || "").trim().toUpperCase();

  if (code) {
    try {
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === "percentage") off = Math.max(off, coupon.discountValue);
        else {
          // fixed discount translate to approximate percentage against avg price 100 for preview
          off = Math.max(off, Math.round((coupon.discountValue / 100) * 100));
        }
      }
    } catch {
      // ignore DB issues
    }
  }
  if (!off) off = 10;

  const deals = baseDeals.map((d) => ({
    ...d,
    price: Math.max(0, Math.round(d.price * (1 - off / 100))),
  }));

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
              <div className="text-base sm:text-lg font-semibold">
                Ưu đãi -{off}% {code && `(mã ${code})`}
              </div>
              <Link href="/destinations" className="btn btn-gradient">Khám phá ngay</Link>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm/6 text-foreground/70">Chọn mức ưu đãi:</span>
            <Link href="/deals?off=10" className="btn">-10%</Link>
            <Link href="/deals?off=15" className="btn">-15%</Link>
            <Link href="/deals?off=20" className="btn">-20%</Link>
            <span className="text-sm/6 text-foreground/60 ml-2">hoặc dùng mã?</span>
            <Link href="/deals?code=SAVE10" className="btn">SAVE10</Link>
            <Link href="/deals?code=SAVE15" className="btn">SAVE15</Link>
          </div>

          <p className="mt-3 text-sm/6 text-foreground/70">
            Giá hiển thị đã áp dụng khuyến mãi tương ứng.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((d) => (
              <DestinationCard key={d.slug} d={d as any} />
            ))}
          </div>
          {deals.length === 0 && (
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