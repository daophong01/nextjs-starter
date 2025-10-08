import DestinationCard from "../../components/DestinationCard";
import FiltersBar from "../../components/FiltersBar";
import SortBar from "../../components/SortBar";
import PaginationBar from "../../components/PaginationBar";

type Search = {
  q?: string;
  from?: string;
  to?: string;
  countries?: string; // comma-separated
  tags?: string; // comma-separated
  priceMin?: string;
  priceMax?: string;
  ratingMin?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function fetchDestinations(searchParams: Search) {
  const params = new URLSearchParams(Object.entries(searchParams).filter(([_, v]) => v));
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/destinations?${params.toString()}`, {
    // cache: "no-store"  // uncomment to disable caching
  });
  if (!res.ok) throw new Error("Failed to fetch destinations");
  return res.json() as Promise<{
    total: number;
    page: number;
    pageSize: number;
    items: Array<{
      slug: string;
      name: string;
      description: string;
      image: string;
      rating: number;
      price: number;
      country: string;
      tags: string[];
    }>;
  }>;
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams?: Search;
}) {
  const pageSize = Math.max(1, Number(searchParams?.pageSize || 9));
  const data = await fetchDestinations({ ...(searchParams || {}), pageSize: String(pageSize) });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Danh sách điểm đến</h1>
      {(searchParams?.from || searchParams?.to || searchParams?.q) && (
        <p className="text-sm/6 text-foreground/70 mt-2">
          Kết quả cho: {searchParams?.q && `"${searchParams.q}"`} {searchParams?.from && `• từ ${searchParams.from}`}{" "}
          {searchParams?.to && `• đến ${searchParams.to}`}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <FiltersBar />
        <div className="flex justify-between items-center">
          <SortBar />
          <span className="text-sm/6 text-foreground/70">Có {data.total} điểm đến</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {data.items.map((d) => (
          <DestinationCard key={d.slug} d={d as any} />
        ))}
        {data.items.length === 0 && (
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6">
            Không tìm thấy điểm đến phù hợp. Hãy thử tiêu chí khác.
          </div>
        )}
      </div>

      <PaginationBar total={data.total} pageSize={data.pageSize} />
    </main>
  );
}