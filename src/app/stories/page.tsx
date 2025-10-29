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
  ];

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Câu chuyện hành trình</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">
          Tổng hợp những trải nghiệm đáng nhớ từ du khách.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
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
      </section>
    </main>
  );
}