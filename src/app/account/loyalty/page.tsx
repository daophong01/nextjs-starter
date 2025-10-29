import Link from "next/link";

export const metadata = {
  title: "Khách hàng thân thiết - TravelGo",
  description: "Điểm thưởng và hạng thành viên.",
};

export default function AccountLoyaltyPage() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Chương trình khách hàng thân thiết</h1>
        <div className="card p-6 mt-6">
          <p className="text-sm/6 text-foreground/70">
            Tính năng điểm thưởng và hạng thành viên sẽ được bổ sung trong bản phát hành tới. Bạn vẫn có thể nhận ưu đãi tại trang Ưu đãi.
          </p>
          <Link href="/deals" className="btn mt-3">Xem Ưu đãi</Link>
        </div>
      </section>
    </main>
  );
}