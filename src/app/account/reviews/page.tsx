import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Đánh giá của tôi - TravelGo",
  description: "Quản lý các đánh giá đã viết.",
};

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default async function AccountReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <main className="container">
        <div className="mt-16 card p-6 text-center">
          <h1 className="text-2xl font-bold">Yêu cầu đăng nhập</h1>
          <p className="text-sm/6 text-foreground/70 mt-2">
            Vui lòng <Link href="/signin" className="underline">đăng nhập</Link> để xem đánh giá của bạn.
          </p>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const items = await prisma.review.findMany({
    where: { userId: user?.id || undefined },
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Đánh giá của tôi</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">
          Hiển thị tối đa 50 đánh giá gần đây.
        </p>

        {items.length === 0 ? (
          <div className="card p-6 mt-6 text-center">
            <p className="text-sm/6 text-foreground/70">Bạn chưa có đánh giá nào.</p>
            <Link href="/destinations" className="btn mt-3">Khám phá điểm đến</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{r.slug}</div>
                    <div className="text-xs/6 text-foreground/70">
                      ⭐ {r.rating} • {fmtDate(r.date)}
                    </div>
                  </div>
                  <div className="text-sm/6">{r.comment}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}