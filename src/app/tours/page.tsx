import TourCard from "@/components/TourCard";
import { tours } from "@/lib/data";

export const metadata = {
  title: "Tour | TravelX",
};

export default function ToursPage() {
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold">Tour nổi bật</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {tours.map((t) => (
          <TourCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}