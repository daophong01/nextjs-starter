import { DESTINATIONS } from "../../data/destinations";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams?: { destination?: string; guests?: string; from?: string; to?: string };
}) {
  const d = DESTINATIONS.find((x) => x.slug === (searchParams?.destination || ""));
  const guests = Number(searchParams?.guests || 2);
  const price = d ? d.price * guests : 0;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Xác nhận đặt chỗ</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-4">
          <h2 className="font-semibold mb-2">Thông tin hành trình</h2>
          {d ? (
            <div className="text-sm/6">
              <p>Điểm đến: <span className="font-semibold">{d.name}</span></p>
              <p>Khách: <span className="font-semibold">{guests}</span></p>
              {searchParams?.from && <p>Ngày đi: <span className="font-semibold">{searchParams.from}</span></p>}
              {searchParams?.to && <p>Ngày về: <span className="font-semibold">{searchParams.to}</span></p>}
            </div>
          ) : (
            <p className="text-sm/6 text-foreground/70">Chưa chọn điểm đến.</p>
          )}

          <form className="mt-4 grid gap-3">
            <label className="text-xs font-medium">Tên người đặt</label>
            <input type="text" placeholder="Nguyễn Văn A" className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />

            <label className="text-xs font-medium">Email</label>
            <input type="email" placeholder="ban@vi.du.lich" className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />

            <label className="text-xs font-medium">Ghi chú</label>
            <textarea placeholder="Yêu cầu đặc biệt..." className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent min-h-[80px]" />
          </form>
        </section>

        <aside className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-4 h-max">
          <h2 className="font-semibold mb-2">Thanh toán</h2>
          <div className="text-sm/6">
            <p>Giá cơ bản: ${d?.price ?? 0} x {guests} khách</p>
            <p>Phí dịch vụ: $15</p>
            <p className="font-semibold mt-2">Tổng: ${price + 15}</p>
          </div>
          <button className="mt-4 rounded-full bg-foreground text-background px-6 py-2 hover:opacity-90">
            Hoàn tất
          </button>
          <p className="text-xs/6 text-foreground/60 mt-2">Thanh toán demo (không thực tế).</p>
        </aside>
      </div>
    </main>
  );
}