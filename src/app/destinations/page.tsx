import DestinationCard from "../../components/DestinationCard";
import { DESTINATIONS } from "../../data/destinations";

export default function DestinationsPage({
  searchParams,
}: {
  searchParams?: { q?: string; from?: string; to?: string };
}) {
  const q = (searchParams?.q || "").toLowerCase().trim();
  const filtered = DESTINATIONS.filter((d) => {
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q))
    );
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {filtered.map((d) => (
          <DestinationCard key={d.slug} d={d} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6">
            Không tìm thấy điểm đến phù hợp. Hãy thử từ khóa khác.
          </div>
        )}
      </div>
    </main>
  );
}