import Link from "next/link";
import { TOURS } from "@/data/tours";
import MapEmbed from "@/components/MapEmbed";

export const metadata = {
  title: "Chi tiết tour - TravelGo",
  description: "Thông tin chi tiết tour, lịch trình, giá, dịch vụ và bản đồ.",
};

export default function TourDetailPage({ params }: { params: { slug: string } }) {
  const t = TOURS.find((x) => x.slug === params.slug);
  if (!t) {
    return (
      <main className="container">
        <div className="mt-12 card p-6">
          Không tìm thấy tour.
          <Link href="/tours" className="underline mt-2 inline-block">Quay lại danh sách →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="mt-8 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <div className="card overflow-hidden">
          <div className="relative h-72">
            <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          </div>
          <div className="p-4">
            <h1 className="text-2xl sm:text-3xl font-bold">{t.name}</h1>
            <p className="text-sm/6 text-foreground/70 mt-1">{t.fromCity} → {t.destination} • {t.days}N • {t.transport}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="font-mono text-sm/6">Từ ${t.price}</span>
              <span className="text-sm/6">⭐ {t.rating}</span>
            </div>

            <h2 className="font-semibold mt-6 mb-2">Lịch trình</h2>
            <div className="grid gap-3">
              {t.schedule.map((s) => (
                <div key={s.day} className="rounded border border-black/[.08] dark:border-white/[.145] p-3">
                  <div className="font-semibold">Ngày {s.day}: {s.title}</div>
                  <div className="text-sm/6 text-foreground/70">{s.details}</div>
                </div>
              ))}
            </div>

            <h2 className="font-semibold mt-6 mb-2">Điểm nổi bật</h2>
            <div className="flex flex-wrap gap-2">
              {t.highlights.map((h) => (
                <span key={h} className="text-xs/6 px-2 py-1 rounded-full border border-black/[.08] dark:border-white/[.145]">#{h}</span>
              ))}
            </div>
          </div>
        </div>

        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Đặt tour</h2>
          <form action="/checkout" method="get" className="grid gap-3">
            <input type="hidden" name="tour" value={t.slug} />
            <label className="text-xs font-medium">Số lượng khách</label>
            <input name="guests" type="number" min={1} defaultValue={2} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
            <label className="text-xs font-medium">Ngày khởi hành</label>
            <input name="from" type="date" className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
            <button className="mt-2 rounded-full bg-foreground text-background px-6 py-2 hover:opacity-90">Đặt ngay</button>
          </form>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Dịch vụ bao gồm</h3>
            <ul className="text-sm/6 list-disc ml-4 text-foreground/80">
              <li>Khách sạn tiêu chuẩn</li>
              <li>Ăn uống theo chương trình</li>
              <li>Vé tham quan</li>
              <li>Bảo hiểm du lịch</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <MapEmbed query={`${t.destination}`} />
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Chính sách</h2>
          <ul className="text-sm/6 list-disc ml-4 text-foreground/80">
            <li>Hoàn tiền 80% trước 7 ngày khởi hành.</li>
            <li>Miễn phí đổi ngày 1 lần.</li>
          </ul>
        </div>
      </section>

      <div className="mt-10">
        <Link href="/tours" className="underline">← Quay lại danh sách</Link>
      </div>
    </main>
  );
}