import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/blog";
import { prisma } from "@/lib/prisma";
import BlogCommentForm from "@/components/BlogCommentForm";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Try DB
  try {
    const post = await prisma.post.findUnique({ where: { slug: params.slug } });
    if (post) {
      return {
        title: `${post.title} | TravelGo`,
        description: post.excerpt,
        openGraph: { title: `${post.title} | TravelGo`, description: post.excerpt, images: [{ url: post.image }] },
        twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
      };
    }
  } catch {}
  const p = POSTS.find((x) => x.slug === params.slug);
  if (!p) {
    return { title: "Bài viết không tồn tại - TravelGo", description: "Không tìm thấy bài viết." };
  }
  return {
    title: `${p.title} | TravelGo`,
    description: p.excerpt,
    openGraph: { title: `${p.title} | TravelGo`, description: p.excerpt, images: [{ url: p.image }] },
    twitter: { card: "summary_large_image", title: p.title, description: p.excerpt, images: [p.image] },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let p = POSTS.find((x) => x.slug === params.slug);
  try {
    const post = await prisma.post.findUnique({ where: { slug: params.slug } });
    if (post) {
      p = { ...post, date: post.date.toISOString(), tags: (post as any).tags || [] } as any;
    }
  } catch {}

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

  const comments = await prisma.comment.findMany({
    where: { approved: true, post: { slug: params.slug } },
    orderBy: { createdAt: "desc" },
    take: 50,
  }).catch(() => []);

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
          {(p.tags || []).map((t: string) => (
            <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="text-xs/6 px-2 py-1 rounded-full border border-black/[.08] dark:border-white/[.145]">
              #{t}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Bình luận</h2>
            {Array.isArray(comments) && comments.length > 0 ? (
              <div className="grid gap-3">
                {comments.map((c: any) => (
                  <div key={c.id} className="rounded border border-black/[.08] dark:border-white/[.145] p-3">
                    <div className="text-xs/6 text-foreground/60">{new Date(c.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm/6">{c.content}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm/6 text-foreground/70">Chưa có bình luận.</p>
            )}
          </div>
          <div className="card p-4 h-max">
            <h3 className="font-semibold mb-2">Gửi bình luận</h3>
            <BlogCommentForm slug={params.slug} />
          </div>
        </div>
      </article>

      <div className="mt-10">
        <Link href="/blog" className="underline">← Quay lại blog</Link>
      </div>
    </main>
  );
}