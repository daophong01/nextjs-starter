import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/blog";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = POSTS.find((x) => x.slug === params.slug);
  if (!p) {
    return { title: "Bài viết không tồn tại - TravelGo", description: "Không tìm thấy bài viết." };
  }
  return {
    title: `${p.title} | TravelGo`,
    description: p.excerpt,
    openGraph: {
      title: `${p.title} | TravelGo`,
      description: p.excerpt,
      images: [{ url: p.image }],
    },
  };
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const p = POSTS.find((x) => x.slug === params.slug);
  if (!p) {
    return (
      <main className="container">
        <div className="mt-12 card p-6">
          Không tìm thấy bài viết.
          <Link href="/blog" className="underline mt-2 inline-block">Quay lại blog →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <article className="mt-8">
        <div className="relative h-56 rounded-2xl overflow-hidden border border-black/[.08] dark:border-white/[.145]">
          <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mt-4">{p.title}</h1>
        <div className="text-xs/6 text-foreground/60 mt-1">
          {new Date(p.date).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} • {p.author}
        </div>
        <div className="prose prose-sm sm:prose">
          <p className="mt-3 text-foreground/80 whitespace-pre-line">{p.content}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="text-xs/6 px-2 py-1 rounded-full border border-black/[.08] dark:border-white/[.145]">
              #{t}
            </Link>
          ))}
        </div>

        <div className="mt-8 card p-4">
          <h2 className="font-semibold mb-2">Bình luận</h2>
          <p className="text-sm/6 text-foreground/70">Tính năng bình luận sẽ sớm được bật. Tạm thời bạn có thể gửi góp ý qua trang <Link href="/contact" className="underline">Liên hệ</Link>.</p>
        </div>
      </article>

      <div className="mt-10">
        <Link href="/blog" className="underline">← Quay lại blog</Link>
      </div>
    </main>
  );
}