import Link from "next/link";

export default function TopStories() {
  const stories = [
    {
      title: "Bali — Thiên đường biển",
      tag: "Biển",
      excerpt: "Khám phá các bãi biển xanh và văn hóa địa phương đặc sắc.",
      image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop",
      href: "/destinations?slug=bali",
    },
    {
      title: "Paris — Lãng mạn về đêm",
      tag: "Lãng mạn",
      excerpt: "Ẩm thực, nghệ thuật và những lối nhỏ thơ mộng.",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
      href: "/destinations?slug=paris",
    },
    {
      title: "Tokyo — Nhịp sống hiện đại",
      tag: "Công nghệ",
      excerpt: "Một ngày tại Shibuya với trải nghiệm đô thị sôi động.",
      image: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop",
      href: "/destinations?slug=tokyo",
    },
  ];

  return (
    <section id="stories" className="mt-12">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Câu chuyện nổi bật</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {stories.map((s) => (
          <article key={s.title} className="card overflow-hidden">
            <div className="aspect-video relative">
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs/6">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
                  B
                </span>
                <span className="rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145]">{s.tag}</span>
              </div>
              <h3 className="font-semibold mt-2">{s.title}</h3>
              <p className="text-sm/6 text-foreground/70 mt-1">{s.excerpt}</p>
              <Link href={s.href} className="text-sm/6 underline mt-2 inline-block">
                Khám phá điểm liên quan →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}