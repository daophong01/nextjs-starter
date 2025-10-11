import Image from "next/image";
import Link from "next/link";
import { destinations, tours } from "@/lib/data";
import ReviewList, { Review } from "@/components/ReviewList";

export function generateStaticParams() {
  return tours.map((t) => ({ id: t.id }));
}

const mockReviews: Record<string, Review[]> = {
  t1: [
    {
      id: "r1",
      user: "Minh Nguyen",
      rating: 4.5,
      comment: "Biển đẹp, lịch trình hợp lý. Hướng dẫn viên nhiệt tình!",
      createdAt: new Date().toISOString(),
    },
  ],
  t2: [
    {
      id: "r2",
      user: "Lan Pham",
      rating: 4.0,
      comment: "Paris lãng mạn, khách sạn ổn. Sẽ quay lại!",
      createdAt: new Date().toISOString(),
    },
  ],
};

export default function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = tours.find((t) => t.id === params.id);
  if (!tour) {
    return <div className="mt-8">Không tìm thấy tour.</div>;
  }
  const dest = destinations.find((d) => d.slug === tour.destinationSlug);

  return (
    <div className="mt-6">
      <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
        <Image src={tour.image} alt={tour.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 p-6 sm:p-10 text-white">
          {dest && <div className="text-sm text-white/80">{dest.name} • {dest.country}</div>}
          <h1 className="text-3xl sm:text-5xl font-bold">{tour.title}</h1>
          <div className="mt-2 text-white/90 max-w-3xl">{tour.summary}</div>
          <div className="mt-3 text-white/90">
            Thời lượng: {tour.durationDays} ngày • Giá: ${tour.price}
          </div>
          <div className="mt-6 flex gap-2">
            <Link
              href={`/book?tour=${tour.id}`}
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white text-black text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Đặt ngay
            </Link>
            {dest && (
              <Link
                href={`/destinations/${dest.slug}`}
                className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
              >
                Xem điểm đến
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold">Ảnh nổi bật</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {[tour.image, tour.image].map((src, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={src} alt={`${tour.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold">Đánh giá</h2>
            <div className="mt-4">
              <ReviewList items={mockReviews[tour.id] || []} />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5">
            <div className="font-medium">Thông tin nhanh</div>
            <ul className="mt-2 text-sm space-y-1 text-foreground/80">
              <li>• Thời lượng: {tour.durationDays} ngày</li>
              {dest && <li>• Điểm đến: {dest.name}, {dest.country}</li>}
              <li>• Giá từ: ${tour.price}</li>
              <li>• Hỗ trợ thanh toán online</li>
            </ul>
            <div className="mt-4">
              <Link
                href={`/book?tour=${tour.id}`}
                className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Đặt tour
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}