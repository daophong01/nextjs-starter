import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import { DESTINATIONS } from "../data/destinations";

export default function Home() {
  const featured = DESTINATIONS.slice(0, 3);

  return (
    <main className="container">
      <section className="mt-10 sm:mt-16 grid gap-6 sm:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <span className="inline-block text-xs/6 font-mono bg-foreground text-background rounded-full px-3 py-1">
            TravelGo
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
            Khám phá thế giới theo cách của bạn
          </h1>
          <p className="mt-3 text-foreground/80">
            Tìm kiếm điểm đến yêu thích, xem gợi ý và đặt chỗ nhanh chóng. TravelGo đồng hành cùng mọi hành trình của bạn.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>

          <div id="deals" className="mt-4 text-sm/6 text-foreground/70">
            Ưu đãi giữa tuần: Giảm đến 20% cho các điểm đến bãi biển.
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="card p-3">
              <div className="text-lg font-semibold">500+</div>
              <div className="text-xs/6 text-foreground/70">Điểm đến</div>
            </div>
            <div className="card p-3">
              <div className="text-lg font-semibold">4.8/5</div>
              <div className="text-xs/6 text-foreground/70">Đánh giá trung bình</div>
            </div>
            <div className="card p-3">
              <div className="text-lg font-semibold">24/7</div>
              <div className="text-xs/6 text-foreground/70">Hỗ trợ</div>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-black/[.08] dark:border-white/[.145] h-64 sm:h-80">
          {/* Decorative hero image */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
            alt="Bãi biển xanh"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <span className="text-sm/6">Ưu đãi mùa hè</span>
            <a href="/destinations" className="rounded-full bg-white/90 text-black px-4 py-1 text-sm/6 hover:bg-white">
              Xem ngay
            </a>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Điểm đến nổi bật</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      <section id="stories" className="mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Câu chuyện hành trình</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <article key={i} className="card p-4">
              <h3 className="font-semibold">Hành trình #{i}</h3>
              <p className="text-sm/6 text-foreground/70 mt-1">
                Những trải nghiệm đáng nhớ từ du khách ở Bali, Paris và Tokyo. Khám phá văn hóa, ẩm thực và thiên nhiên độc đáo.
              </p>
              <a href="/destinations" className="text-sm/6 underline mt-2 inline-block">Đọc thêm →</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
