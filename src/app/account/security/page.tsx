import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Bảo mật - TravelGo",
  description: "Thiết lập bảo mật tài khoản.",
};

export default async function AccountSecurityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <main className="container">
        <div className="mt-16 card p-6 text-center">
          <h1 className="text-2xl font-bold">Yêu cầu đăng nhập</h1>
          <p className="text-sm/6 text-foreground/70 mt-2">
            Vui lòng <Link href="/signin" className="underline">đăng nhập</Link> để truy cập bảo mật.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Bảo mật</h1>
        <div className="card p-6 mt-6">
          <ul className="grid gap-3 text-sm/6">
            <li>• Đổi mật khẩu: truy cập <Link href="/reset-password" className="underline">Đặt lại mật khẩu</Link>.</li>
            <li>• Đăng nhập OAuth: Google/GitHub.</li>
            <li>• Đăng xuất thiết bị: tạm thời đăng xuất thủ công từng thiết bị.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}