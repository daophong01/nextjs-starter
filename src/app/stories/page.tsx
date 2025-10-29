import Link from "next/link";

export const metadata = {
  title: "Câu chuyện hành trình - TravelGo",
  description: "Tổng hợp câu chuyện và trải nghiệm từ du khách.",
};

export default function StoriesPage() {
  const stories = [
    {
      id: 1,
      title: "Bali mùa nắng",
      excerpt:
        "Hành trình khám phá bãi biển xanh, đồ ăn địa phương và văn hóa bản địa.",
      href: "/destinations?tags=beach,resort",
    },
    {
      id: 2,
      title: "Paris về đêm",
      excerpt:
        "Khám phá ẩm thực đường phố, nghệ thuật và những lối nhỏ lãng mạn.",
      href: "/destinations?tags=city,food",
    },
    {
      id: 3,
      title: "Tokyo hiện đại",
      excerpt:
        "Công nghệ, văn hóa và những điểm dừng chân thú vị dành cho người yêu khám phá.",
      href: "/destinations?tags=city,culture",
    },
    {
      id: 4,
      title: "Đà Nẵng – biển và núi",
      excerpt:
        "Từ bãi biển Mỹ Khê tới Bà Nà Hills, một lịch trình 3 ngày trọn vẹn.",
      href: "/destinations?slug=da-nang",
    },
    {
      id: 5,
      title: "Hà Nội – phố cổ và cà phê",
      excerpt:
        "Dạo quanh hồ Gươm, thử cà phê trứng và món ăn đường phố.",
      href: "/destinations?slug=ha-noi",
    },
    {
      id: 6,
      title: "Tokyo – 24 giờ ở Shibuya",
      excerpt:
        "Một ngày khám phá nhịp sống sôi động tại Shibuya Crossing.",
      href: "/destinations?slug=tokyo",
    },
  ];

  const tags = [
    { label: "Biển", href: "/destinations?tags=beach" },
    { label: "Thành phố", href: "/destinations?tags=city" },
    { label: "Ẩm thực", href: "/destinations?tags=food" },
    { label: "Văn hóa", href: "/destinations?tags=culture" },
    { label: "Resort", href: "/destinations?tags=resort" },
    { label: "Thiên nhiên", href: "/destinations?tags=nature" },
  ];

  return (
    <main className="container">
      <section className="mt-8 grid gap-6 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <h1 className="text-2xl font-bold">Câu chuyện hành trình</h1>
          <p className="text-sm/6 text-foreground/70 mt-1">
            Tổng hợp những trải nghiệm đáng nhớ từ du khách.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {stories.map((s) => (
              <article key={s.id} className="card p-4">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm/6 text-foreground/70 mt-1">{s.excerpt}</p>
                <Link href={s.href} className="text-sm/6 underline mt-2 inline-block">
                  Khám phá điểm liên quan →
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Chủ đề phổ biến</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link key={t.label} href={t.href} className="btn">
                {t.label}
              </Link>
            ))}
          </div>
          <p className="text-xs/6 text-foreground/60 mt-2">
            Chọn chủ đề để xem thêm điểm đến liên quan.
          </p>
        </aside>
      </section>
    </main>
  );
}