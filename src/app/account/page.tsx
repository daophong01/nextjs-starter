import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/");

  const bookings = await prisma.booking.findMany({
    where: { email: user.email },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Tài khoản của tôi</h1>
      <p className="text-sm/6 text-foreground/70">Quản lý hồ sơ và xem lịch sử đặt chỗ.</p>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Hồ sơ</h2>
          <p className="text-sm/6">Tên: {user.name || "Chưa có"}</p>
          <p className="text-sm/6">Email: {user.email}</p>
          <p className="text-sm/6">Đã xác thực: {user.emailVerified ? "Có" : "Chưa"}</p>
          <div className="mt-3">
            <a href="/account/security" className="btn">Bảo mật & Đổi mật khẩu</a>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="font-semibold mb-2">Hành động</h2>
          <form action="/api/account/delete" method="POST" className="grid gap-2">
            <button className="btn">Xóa tài khoản</button>
            <span className="text-xs/6 text-foreground/60">Hành động không thể hoàn tác.</span>
          </form>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold mb-2">Lịch sử đặt chỗ</h2>
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
              </div>
            </div>
          ))}
          {bookings.length === 0 && <div className="card p-4">Chưa có đặt chỗ.</div>}
        </div>
      </section>
    </main>
  );
}