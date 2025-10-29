import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

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

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Hồ sơ</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">
          Email: <span className="font-medium">{session.user.email}</span>
        </p>

        <div className="card p-6 mt-6">
          <p className="text-sm/6 text-foreground/70">
            Trang này sẽ cho phép cập nhật tên hiển thị, số điện thoại và địa chỉ trong lần triển khai tiếp theo.
          </p>
        </div>
      </section>
    </main>
  );
}