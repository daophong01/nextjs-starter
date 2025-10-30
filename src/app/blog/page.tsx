import Link from "next/link";
import type { Metadata } from "next";
import { POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog du lịch - TravelGo",
  description: "Kinh nghiệm, review và mẹo du lịch cập nhật.",
  openGraph: {
    title: "Blog du lịch - TravelGo",
    description: "Kinh nghiệm, review và mẹo du lịch cập nhật.",
  },
};

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { q?: string; tag?: string };
}) {
  const q = (searchParams?.q || "").toLowerCase().trim();
  const tag = (searchParams?.tag || "").toLowerCase().trim();

  const filtered = POSTS.filter((p) => {
    const mq =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q);
    const mt = !tag || p.tags.map((t) => t.toLowerCase()).includes(tag);
    return mq && mt;
  });

  const tags = Array.from(new Set(POSTS.flatMap((p) => p.tags)));

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Blog du lịch</h1>
        <form className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_1fr_auto]">
          <input name="q" placeholder="Tìm bài viết..." className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
          <select name="tag" className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent">
            <option value="">Chủ đề</option>
            {tags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button className="btn w-max">Lọc</button>
        </form>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card overflow-hidden">
              <div className="relative h-40">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm/6 text-foreground/70 mt-1">{p.excerpt}</p>
                <div className="text-xs/6 text-foreground/60 mt-1">
                  {new Date(p.date).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} • {p.author}
                </div>
                <span className="text-sm/6 underline mt-2 inline-block">Đọc tiếp →</span>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="card p-6">Không có bài viết phù hợp.</div>
          )}
        </div>
      </section>
    </main>
  );
}