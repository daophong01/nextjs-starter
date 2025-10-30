import Link from "next/link";
import { TOURS } from "@/data/tours";

export const metadata = {
  title: "Danh sách tour - TravelGo",
  description: "Tìm và chọn tour phù hợp theo điểm khởi hành, giá, thời gian, phương tiện.",
};

export default function ToursPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    from?: string;
    transport?: string;
    sort?: string; // price-asc | price-desc | rating-desc | days-asc
  };
}) {
  const q = (searchParams?.q || "").toLowerCase().trim();
  const from = (searchParams?.from || "").toLowerCase().trim();
  const transport = (searchParams?.transport || "").toLowerCase().trim();
  const sort = searchParams?.sort || "";

  const filtered = TOURS.filter((t) => {
    const mq =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.highlights.some((h) => h.toLowerCase().includes(q));
    const mf = !from || t.fromCity.toLowerCase().includes(from);
    const mt = !transport || t.transport === transport;
    return mq && mf && mt;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "days-asc":
        return a.days - b.days;
      default:
        return 0;
    }
  });

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Danh sách tour</h1>
        <form className="mt-4 grid gap-3 sm:grid-cols-4">
          <input name="q" placeholder="Tìm tour..." className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
          <input name="from" placeholder="Điểm khởi hành..." className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
          <select name="transport" className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent">
            <option value="">Phương tiện</option>
            <option value="bus">Xe bus</option>
            <option value="flight">Máy bay</option>
            <option value="train">Tàu</option>
            <option value="mixed">Kết hợp</option>
          </select>
          <select name="sort" className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent">
            <option value="">Sắp xếp</option>
            <option value="price-asc">Giá tăng</option>
            <option value="price-desc">Giá giảm</option>
            <option value="rating-desc">Đánh giá cao</option>
            <option value="days-asc">Ngày ít → nhiều</option>
          </select>
          <button className="btn w-max">Lọc</button>
        </form>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {sorted.map((t) => (
            <Link key={t.slug} href={`/tours/${t.slug}`} className="card overflow-hidden">
              <div className="relative h-48">
                <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm/6 text-foreground/70 mt-1">{t.fromCity} → {t.destination} • {t.days}N • {t.transport}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-sm/6">Từ ${t.price}</span>
                  <span className="text-sm/6">⭐ {t.rating}</span>
                </div>
                <span className="text-sm/6 underline mt-2 inline-block">Chi tiết →</span>
              </div>
            </Link>
          ))}
          {sorted.length === 0 && (
            <div className="card p-6">Không có tour phù hợp.</div>
          )}
        </div>
      </section>
    </main>
  );
}