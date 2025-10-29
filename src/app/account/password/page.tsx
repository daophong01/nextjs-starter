import Link from "next/link";

export const metadata = {
  title: "Đổi mật khẩu - TravelGo",
  description: "Thay đổi mật khẩu tài khoản.",
};

export default function AccountPasswordPage() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Đổi mật khẩu</h1>
        <div className="card p-6 mt-6">
          <p className="text-sm/6 text-foreground/70">
            Vui lòng sử dụng trang <Link href="/reset-password" className="underline">Đặt lại mật khẩu</Link>. Tính năng đổi mật khẩu trực tiếp sẽ được bổ sung sau.
          </p>
        </div>
      </section>
    </main>
  );
}