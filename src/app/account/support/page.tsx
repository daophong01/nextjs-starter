import Link from "next/link";

export const metadata = {
  title: "Hỗ trợ - TravelGo",
  description: "Liên hệ và tạo ticket hỗ trợ.",
};

export default function AccountSupportPage() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Hỗ trợ khách hàng</h1>
        <div className="card p-6 mt-6">
          <p className="text-sm/6 text-foreground/70">
            Vui lòng sử dụng widget Chat hỗ trợ ở góc dưới để liên hệ nhanh. Tính năng ticket sẽ được bổ sung sau.
          </p>
          <Link href="/destinations" className="btn mt-3">Khám phá điểm đến</Link>
        </div>
      </section>
    </main>
  );
}