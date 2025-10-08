import DestinationCard from "../../components/DestinationCard";
import FiltersBar from "../../components/FiltersBar";
import SortBar from "../../components/SortBar";
import PaginationBar from "../../components/PaginationBar";
import { DESTINATIONS } from "../../data/destinations";

export default function DestinationsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    from?: string;
    to?: string;
    country?: string;
    tags?: string; // comma-separated, e.g. "beach,city"
    priceMin?: string;
    priceMax?: string;
    ratingMin?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
  };
}) {
  const q = (searchParams?.q || "").toLowerCase().trim();
  const priceMin = Number(searchParams?.priceMin || 0);
  const priceMax = Number(searchParams?.priceMax || Infinity);
  const ratingMin = Number(searchParams?.ratingMin || 0);
  const country = searchParams?.country || "";
  const tags = (searchParams?.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const sort = searchParams?.sort || "";
  const pageSize = Math.max(1, Number(searchParams?.pageSize || 9));
  const page = Math.max(1, Number(searchParams?.page || 1));

  const filtered = DESTINATIONS.filter((d) => {
    const matchQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q));
    const matchCountry = !country || d.country === country;
    const matchTags =
      tags.length === 0 || tags.every((t) => d.tags.includes(t));
    const matchPrice = d.price >= priceMin && d.price <= priceMax;
    const matchRating = d.rating >= ratingMin;
    return matchQ && matchCountry && matchTags && matchPrice && matchRating;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const total = sorted.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paged = sorted.slice(start, end);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Danh sách điểm đến</h1>
      {(searchParams?.from || searchParams?.to || q) && (
        <p className="text-sm/6 text-foreground/70 mt-2">
          Kết quả cho: {q && `"${q}"`} {searchParams?.from && `• từ ${searchParams.from}`}{" "}
          {searchParams?.to && `• đến ${searchParams.to}`}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <FiltersBar />
        <div className="flex justify-between items-center">
          <SortBar />
          <span className="text-sm/6 text-foreground/70">Có {total} điểm đến</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {paged.map((d) => (
          <DestinationCard key={d.slug} d={d} />
        ))}
        {paged.length === 0 && (
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6">
            Không tìm thấy điểm đến phù hợp. Hãy thử tiêu chí khác.
          </div>
        )}
      </div>

      <PaginationBar total={total} pageSize={pageSize} />
    </main>
  );
}