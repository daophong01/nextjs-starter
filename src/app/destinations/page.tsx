import DestinationCard from "@/components/DestinationCard";
import { destinations } from "@/lib/data";

export const metadata = {
  title: "Điểm đến | TravelX",
};

export default function DestinationsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = (searchParams?.search as string)?.toLowerCase().trim() || "";
  const filtered = q
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.highlights.some((h) => h.toLowerCase().includes(q))
      )
    : destinations;

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold">Điểm đến</h1>
      {q && (
        <div className="text-sm text-foreground/70 mt-1">
          Kết quả cho: "<span className="font-medium">{q}</span>"
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((d) => (
          <DestinationCard key={d.slug} d={d} />
        ))}
      </div>
    </div>
  );
}