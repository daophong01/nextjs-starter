import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Search = {
  q?: string;
  status?: string; // pending, paid, cancelled
  page?: string;
  pageSize?: string;
};

export default async function OrdersPage({ searchParams }: { searchParams?: Search }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");

  const q = (searchParams?.q || "").toLowerCase().trim();
  const status = (searchParams?.status || "").trim();
  const page = Math.max(1, Number(searchParams?.page || 1));
  const pageSize = Math.max(1, Number(searchParams?.pageSize || 10));

  const where: any = {
    email: session.user.email,
  };
  if (status) where.status = status;

  const [total, rows] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items = rows.filter((b) => {
    if (!q) return true;
    return (b.destination || "").toLowerCase().includes(q) || (b.id || "").toLowerCase().includes(q);
  });

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Đơn đặt chỗ của tôi</h1>
      <p className="text-sm/6 text-foreground/70">Tìm kiếm, lọc trạng thái và phân trang.</p>

      <section className="mt-4 card p-4">
        <form className="flex flex-wrap items-center gap-3" action="/orders" method="GET">
          <input name="q" placeholder="Tìm theo điểm đến hoặc mã đơn" defaultValue={q} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent flex-1 min-w-[220px]" />
          <select name="status" defaultValue={status} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="cancelled">cancelled</option>
          </select>
          <select name="pageSize" defaultValue={String(pageSize)} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <button className="btn btn-primary">Lọc</button>
        </form>
      </section>

      <section className="mt-6 grid gap-3">
        {items.map((b) => (
          <div key={b.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm/6">{b.id}</div>
              <span className="text-xs/6 rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145]">{b.status}</span>
            </div>
            <div className="text-sm/6 mt-2">
              <p>Điểm đến: {b.destination || "N/A"}</p>
              <p>Khách: {b.guests}</p>
              <p>Thời gian: {b.from || "-"} → {b.to || "-"}</p>
              <p>Tổng: ${b.price}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="card p-4">Không có đơn phù hợp.</div>}
      </section>

      <section className="mt-6 flex items-center justify-between">
        <div className="text-sm/6">Tổng: {total} đơn</div>
        <div className="flex gap-2">
          {page > 1 && <a className="btn" href={`/orders?${new URLSearchParams({ ...searchParams, page: String(page - 1) } as any).toString()}`}>← Trang trước</a>}
          {page * pageSize < total && <a className="btn" href={`/orders?${new URLSearchParams({ ...searchParams, page: String(page + 1) } as any).toString()}`}>Trang sau →</a>}
        </div>
      </section>
    </main>
  );
}