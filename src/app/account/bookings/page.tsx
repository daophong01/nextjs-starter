import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Đơn đặt chỗ của tôi - TravelGo",
  description: "Xem và quản lý đơn đặt chỗ của bạn.",
};

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default async function AccountBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <main className="container">
        <div className="mt-16 card p-6 text-center">
          <h1 className="text-2xl font-bold">Yêu cầu đăng nhập</h1>
          <p className="text-sm/6 text-foreground/70 mt-2">
            Vui lòng <Link href="/signin" className="underline">đăng nhập</Link> để xem đơn đặt chỗ của bạn.
          </p>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const items = await prisma.booking.findMany({
    where: { userId: user?.id || undefined, email: session.user.email },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Đơn đặt chỗ của tôi</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">
          Hiển thị tối đa 50 đơn gần đây.
        </p>

        {items.length === 0 ? (
          <div className="card p-6 mt-6 text-center">
            <p className="text-sm/6 text-foreground/70">Bạn chưa có đơn đặt chỗ nào.</p>
            <Link href="/destinations" className="btn mt-3">Khám phá điểm đến</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((o) => (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs/6">{o.id}</div>
                    <div className="text-sm/6">{o.destination || "Điểm đến"}</div>
                    <div className="text-xs/6 text-foreground/70">
                      {o.guests} khách • {fmtDate(o.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm/6">Tổng: ${o.totalAmount || o.price}</div>
                    <span className="btn mt-1">{o.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}