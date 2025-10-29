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
  ];

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Danh mục</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">
          Khám phá các chủ đề du lịch phổ biến.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.title} href={c.href} className="card p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm/6 text-foreground/70 mt-1">{c.desc}</p>
              <span className="text-sm/6 underline mt-2 inline-block">Xem gợi ý →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}