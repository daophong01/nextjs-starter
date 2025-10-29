import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Hồ sơ - TravelGo",
  description: "Thông tin cá nhân của bạn.",
};

export default async function AccountProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <main className="container">
        <div className="mt-16 card p-6 text-center">
          <h1 className="text-2xl font-bold">Yêu cầu đăng nhập</h1>
          <p className="text-sm/6 text-foreground/70 mt-2">
            Vui lòng <Link href="/signin" className="underline">đăng nhập</Link> để xem hồ sơ.
          </p>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: { select: { provider: true, providerAccountId: true } },
    },
  });

  const providers = (user?.accounts || []).map((a) => a.provider.toUpperCase());
  const verified = Boolean(user?.emailVerified);
  const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-";

  // Recent 5 bookings
  const bookings = await prisma.booking.findMany({
    where: { userId: user?.id || undefined, email: session.user.email },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="container">
      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Profile summary */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">Hồ sơ</h2>
          <div className="grid gap-2 text-sm/6">
            <div>Tên: <span className="font-medium">{user?.name || "(chưa đặt)"}</span></div>
            <div>Email: <span className="font-medium">{session.user.email}</span></div>
            <div>Đã xác thực: {verified ? "Rồi" : "Chưa"}</div>
            <div>Nhà cung cấp đăng nhập: {providers.length ? providers.join(", ") : "credentials"}</div>
            <div>Role: <span className="font-medium">{user?.role || "user"}</span></div>
            <div>Tham gia: <span className="font-medium">{createdAt}</span></div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/account/security" className="btn">Bảo mật & Đổi mật khẩu</Link>
            <Link href="/account/avatar" className="btn">Ảnh đại diện</Link>
          </div>
        </div>

        {/* Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">Hành động</h2>
          <div className="grid gap-3">
            <Link href="/account/settings" className="btn">Cài đặt tài khoản</Link>
            <Link href="/account/notifications" className="btn">Thông báo</Link>
            <Link href="/account/support" className="btn">Hỗ trợ</Link>
          </div>
          <p className="text-xs/6 text-foreground/60 mt-3">Các hành động quản trị/xóa tài khoản sẽ thêm sau.</p>
        </div>
      </section>

      {/* Recent bookings */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Đơn đặt chỗ gần đây</h2>
        {bookings.length === 0 ? (
          <div className="card p-6 mt-3 text-center">
            <p className="text-sm/6 text-foreground/70">Chưa có đặt chỗ.</p>
            <Link href="/destinations" className="btn mt-3">Khám phá điểm đến</Link>
          </div>
        ) : (
          <div className="mt-3 grid gap-3">
            {bookings.map((o) => (
              <div key={o.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs/6">{o.id}</div>
                  <div className="text-sm/6">{o.destination || "Điểm đến"}</div>
                  <div className="text-xs/6 text-foreground/70">
                    {o.guests} khách • {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm/6">Tổng: ${o.totalAmount || o.price}</div>
                  <span className="btn mt-1">{o.status}</span>
                </div>
              </div>
            ))}
            <Link href="/account/bookings" className="underline text-sm/6">Xem tất cả →</Link>
          </div>
        )}
      </section>
    </main>
  );
}