import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import { destinations, tours } from "@/lib/data";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 mt-6">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2400&auto=format&fit=crop"
            alt="Hero Travel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative px-6 sm:px-10 py-24 text-white">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight max-w-3xl">
            Khám phá thế giới theo cách của bạn
          </h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Tìm điểm đến mơ ước, chọn tour phù hợp và đặt chỗ chỉ trong vài phút.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
          <div className="mt-4 text-sm text-white/80">
            Gợi ý: Bali, Paris, Kyoto, Cape Town
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Điểm đến phổ biến</h2>
          <Link href="/destinations" className="text-sm text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {destinations.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="pb-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Tour nổi bật</h2>
          <Link href="/tours" className="text-sm text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tours.map((t) => (
            <TourCard key={t.id} t={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
