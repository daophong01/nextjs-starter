import Link from "next/link";

export const metadata = {
  title: "Thông báo - TravelGo",
  description: "Quản lý thông báo.",
};

export default function AccountNotificationsPage() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Thông báo</h1>
        <div className="card p-6 mt-6">
          <p className="text-sm/6 text-foreground/70">
            Tính năng thông báo sẽ được triển khai sau (email/push). Hiện bạn có thể kiểm tra cập nhật tại trang chủ và email xác nhận đặt chỗ.
          </p>
          <Link href="/" className="btn mt-3">Về trang chủ</Link>
        </div>
      </section>
    </main>
  );
}