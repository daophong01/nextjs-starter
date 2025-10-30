import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import HeroCarousel from "../components/HeroCarousel";
import TopBannerCarousel from "../components/TopBannerCarousel";
import { DESTINATIONS } from "../data/destinations";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featured = DESTINATIONS.slice(0, 6);
  const latestReviews = await prisma.review.findMany({
    orderBy: { date: "desc" },
    take: 3,
  });

  return (
    <main className="container">
      {/* Brand banner */}
      <section className="mt-6 sm:mt-10">
        <TopBannerCarousel />

        {/* Trusted brands */}
        <div className="mt-3 sm:mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Booking.com_logo.svg/2560px-Booking.com_logo.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Expedia_Logo.svg/2560px-Expedia_Logo.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Tripadvisor_Logo_green.svg/2560px-Tripadvisor_Logo_green.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Skyscanner_logo_2020.svg/2560px-Skyscanner_logo_2020.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kayak_Logo_2016.svg/2560px-Kayak_Logo_2016.svg.png",
          ].map((src, i) => (
            <div key={i} className="card p-2 flex items-center justify-center">
              <img src={src} alt="Brand" className="h-6 sm:h-7 opacity-80" />
            </div>
          ))}
        </div>
      </section>

      {/* Hero */}
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

        <HeroCarousel
          images={[
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop",
          ]}
          ctaHref="/destinations"
          ctaText="Khám phá ngay"
        />
      </section>

      {/* Categories */}
      <section className="mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Khám phá theo sở thích</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { title: "Biển & Resort", desc: "Bãi biển đẹp, nghỉ dưỡng sang trọng", href: "/destinations?tags=beach,resort" },
            { title: "Thành phố & Ẩm thực", desc: "Văn hóa đa dạng, món ngon địa phương", href: "/destinations?tags=city,food" },
            { title: "Thiên nhiên & Phiêu lưu", desc: "Phong cảnh hùng vĩ, trải nghiệm độc đáo", href: "/destinations?tags=nature" },
          ].map((c) => (
            <a key={c.title} href={c.href} className="card p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm/6 text-foreground/70 mt-1">{c.desc}</p>
              <span className="text-sm/6 underline mt-2 inline-block">Xem gợi ý →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Điểm đến nổi bật</h2>
          <a href="/destinations" className="underline text-sm/6">Xem tất cả →</a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Đánh giá mới nhất</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {latestReviews.map((r) => (
            <article key={r.id} className="card p-4">
              <h3 className="font-semibold">{r.slug}</h3>
              <p className="text-xs/6 text-foreground/70">⭐ {r.rating} • {new Date(r.date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
              <p className="text-sm/6 mt-2">{r.comment}</p>
              <a href={`/destinations?q=${encodeURIComponent(r.slug)}`} className="text-sm/6 underline mt-2 inline-block">Xem điểm đến →</a>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-12">
        <div className="card p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold">Sẵn sàng cho chuyến đi tiếp theo?</h2>
          <p className="text-sm/6 text-foreground/70 mt-2">
            Tạo tài khoản để lưu yêu thích, quản lý đặt chỗ và nhận ưu đãi riêng.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a href="/signup" className="btn btn-primary">Đăng ký</a>
            <a href="/signin" className="btn">Đăng nhập</a>
          </div>
        </div>
      </section>
    </main>
  );
}
