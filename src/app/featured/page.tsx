import DestinationCard from "@/components/DestinationCard";
import { DESTINATIONS } from "@/data/destinations";

export const metadata = {
  title: "Điểm đến nổi bật - TravelGo",
  description: "Top điểm đến được yêu thích, đánh giá cao.",
};

export default function FeaturedPage() {
  const featured = DESTINATIONS.slice(0, 9);

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Điểm đến nổi bật</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">
          Top điểm đến được yêu thích bởi khách hàng.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
      </section>
    </main>
  );
}