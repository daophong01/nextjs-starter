import DestinationCard from "../../components/DestinationCard";
import { DESTINATIONS } from "../../data/destinations";

export default function DealsPage() {
  const deals = DESTINATIONS.filter((d) => d.tags.includes("beach") || d.tags.includes("city"));

  return (
    <main className="container">
      <section className="mt-10 sm:mt-16">
        <h1 className="text-2xl sm:text-3xl font-bold">Ưu đãi hấp dẫn</h1>
        <p className="mt-2 text-sm/6 text-foreground/70">
          Tổng hợp các điểm đến có ưu đãi -10% cho mùa này. Giá hiển thị đã áp dụng khuyến mãi.
        </p>
        <div className="mt-4 card p-4">
          <ul className="text-sm/6 list-disc ml-4 text-foreground/80">
            <li>Áp dụng cho các điểm đến thuộc nhóm “beach” hoặc “city”.</li>
            <li>Thời gian: trong tháng hiện tại.</li>
            <li>Đặt chỗ an toàn, hỗ trợ 24/7.</li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
        {deals.length === 0 && (
          <div className="mt-6 card p-6">Hiện chưa có ưu đãi nào. Vui lòng quay lại sau.</div>
        )}
      </section>
    </main>
  );
}