import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const [bookings, reviews] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.review.findMany({ orderBy: { date: "desc" } }),
  ]);

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Bảng điều khiển (Admin)</h1>
      <p className="text-sm/6 text-foreground/70">Xem nhanh đơn đặt chỗ và đánh giá gần đây.</p>

      <section className="mt-6">
        <h2 className="font-semibold mb-2">Đơn đặt chỗ</h2>
        <div className="grid gap-3">
          {bookings.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm/6">{b.id}</div>
                <span className="text-xs/6 rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145]">{b.status}</span>
              </div>
              <div className="text-sm/6 mt-2">
                <p>Điểm đến: {b.destination || "N/A"}</p>
                <p>Khách: {b.guests}</p>
                <p>Thời gian: {b.from || "-"} → {b.to || "-"}</p>
                <p>Tổng: ${b.price}</p>
                <p>Người đặt: {b.name} — {b.email}</p>
              </div>
            </div>
          ))}
          {bookings.length === 0 && <div className="card p-4">Chưa có đơn đặt chỗ.</div>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold mb-2">Đánh giá gần đây</h2>
        <div className="grid gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm/6">{r.slug}</div>
                <span className="text-sm/6">⭐ {r.rating}</span>
              </div>
              <p className="text-sm/6 mt-2">{r.comment}</p>
              <p className="text-xs/6 text-foreground/60 mt-1">{r.author} — {r.date}</p>
            </div>
          ))}
          {reviews.length === 0 && <div className="card p-4">Chưa có đánh giá.</div>}
        </div>
      </section>
    </main>
  );
}