import Link from "next/link";

export const metadata = {
  title: "Yêu thích - TravelGo",
  description: "Danh sách điểm đến yêu thích (lưu cục bộ).",
};

export default function WishlistPage() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Yêu thích</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">
          Tính năng đang trong quá trình hoàn thiện. Tạm thời, bạn có thể đánh dấu yêu thích trực tiếp trên trang điểm đến.
        </p>
        <div className="card p-6 mt-6 text-center">
          <p className="text-sm/6 text-foreground/70">Quay lại danh sách điểm đến để tiếp tục khám phá.</p>
          <Link href="/destinations" className="btn mt-3">Khám phá điểm đến</Link>
        </div>
      </section>
    </main>
  );
}