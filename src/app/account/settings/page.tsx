import Link from "next/link";

export const metadata = {
  title: "Cài đặt - TravelGo",
  description: "Tùy chỉnh giao diện và tùy chọn.",
};

export default function AccountSettingsPage() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <div className="card p-6 mt-6 grid gap-3">
          <div className="text-sm/6">• Giao diện: sáng/tối (tự động theo hệ thống).</div>
          <div className="text-sm/6">• Ngôn ngữ: tiếng Việt (mặc định).</div>
          <div className="text-sm/6">• Đơn vị tiền tệ: VND/USD (theo cổng thanh toán).</div>
          <Link href="/" className="btn mt-2 w-max">Lưu (demo)</Link>
        </div>
      </section>
    </main>
  );
}