import DestinationCard from "../../components/DestinationCard";
import FiltersBar from "../../components/FiltersBar";
import { DESTINATIONS } from "../../data/destinations";

export default function DestinationsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    from?: string;
    to?: string;
    country?: string;
    tag?: string;
    priceMin?: string;
    priceMax?: string;
    ratingMin?: string;
  };
}) {
  const q = (searchParams?.q || "").toLowerCase().trim();
  const priceMin = Number(searchParams?.priceMin || 0);
  const priceMax = Number(searchParams?.priceMax || Infinity);
  const ratingMin = Number(searchParams?.ratingMin || 0);
  const country = searchParams?.country || "";
  const tag = searchParams?.tag || "";

  const filtered = DESTINATIONS.filter((d) => {
    const matchQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q));
    const matchCountry = !country || d.country === country;
    const matchTag = !tag || d.tags.includes(tag);
    const matchPrice = d.price >= priceMin && d.price <= priceMax;
    const matchRating = d.rating >= ratingMin;
    return matchQ && matchCountry && matchTag && matchPrice && matchRating;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Danh sách điểm đến</h1>
      {(searchParams?.from || searchParams?.to || q) && (
        <p className="text-sm/6 text-foreground/70 mt-2">
          Kết quả cho: {q && `"${q}"`} {searchParams?.from && `• từ ${searchParams.from}`}{" "}
          {searchParams?.to && `• đến ${searchParams.to}`}
        </p>
      )}

      <FiltersBar />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {filtered.map((d) => (
          <DestinationCard key={d.slug} d={d} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6">
            Không tìm thấy điểm đến phù hợp. Hãy thử tiêu chí khác.
          </div>
        )}
      </div>
    </main>
  );
}