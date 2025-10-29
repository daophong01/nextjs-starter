import Link from "next/link";

export const metadata = {
  title: "Danh mục - TravelGo",
  description: "Khám phá theo sở thích: biển, thành phố, thiên nhiên.",
};

export default function CategoriesPage() {
  const categories = [
    {
      title: "Biển & Resort",
      desc: "Bãi biển đẹp, nghỉ dưỡng sang trọng",
      href: "/destinations?tags=beach,resort",
    },
    {
      title: "Thành phố & Ẩm thực",
      desc: "Văn hóa đa dạng, món ngon địa phương",
      href: "/destinations?tags=city,food",
    },
    {
      title: "Thiên nhiên & Phiêu lưu",
      desc: "Phong cảnh hùng vĩ, trải nghiệm độc đáo",
      href: "/destinations?tags=nature",
    },
    {
      title: "Lãng mạn",
      desc: "Cặp đôi, cảnh đẹp thơ mộng",
      href: "/destinations?tags=romantic",
    },
    {
      title: "Bảo tàng & Văn hóa",
      desc: "Nghệ thuật, lịch sử và di sản",
      href: "/destinations?tags=museum,culture",
    },
    {
      title: "Công nghệ & Hiện đại",
      desc: "Thành phố thông minh, trải nghiệm số",
      href: "/destinations?tags=tech,city",
    },
  ];

  const tips = [
    "Đặt sớm để có giá tốt hơn.",
    "Kiểm tra thời tiết trước khi chọn điểm đến.",
    "Ưu tiên điểm đến có đánh giá > 4.5 nếu đi cùng gia đình.",
    "Sử dụng Ưu đãi để tiết kiệm chi phí.",
  ];

  return (
    <main className="container">
      <section className="mt-8 grid gap-6 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <h1 className="text-2xl font-bold">Danh mục</h1>
          <p className="text-sm/6 text-foreground/70 mt-1">
            Khám phá các chủ đề du lịch phổ biến.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <Link key={c.title} href={c.href} className="card p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm/6 text-foreground/70 mt-1">{c.desc}</p>
                <span className="text-sm/6 underline mt-2 inline-block">Xem gợi ý →</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Mẹo chọn điểm đến</h2>
          <ul className="list-disc pl-5 text-sm/6 text-foreground/70">
            {tips.map((t, i) => (
              <li key={i} className="mb-1">{t}</li>
            ))}
          </ul>
          <div className="mt-3">
            <Link href="/deals" className="btn">Xem Ưu đãi</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}