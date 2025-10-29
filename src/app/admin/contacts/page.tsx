import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminContactReply from "@/components/AdminContactReply";

export const metadata = {
  title: "Liên hệ - Admin",
  description: "Danh sách liên hệ khách hàng",
};

async function toggleProcessed(id: string, processed: boolean) {
  "use server";
  await prisma.contactMessage.update({ where: { id }, data: { processed } });
}

async function deleteContact(id: string) {
  "use server";
  await prisma.contactMessage.delete({ where: { id } });
}

export default async function AdminContactsPage({ searchParams }: { searchParams?: { q?: string; processed?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <main className="container mt-16">Unauthorized</main>;
  }
  const me = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!me || me.role !== "admin") {
    return <main className="container mt-16">Forbidden</main>;
  }

  const q = (searchParams?.q || "").trim().toLowerCase();
  const processed = searchParams?.processed;

  const where: any = {};
  if (processed === "true") where.processed = true;
  else if (processed === "false") where.processed = false;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { message: { contains: q } },
    ];
  }

  const items = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const currentProcessed = processed || "all";

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Liên hệ khách hàng</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">Hiển thị tối đa 200 liên hệ gần nhất.</p>

        <div className="mt-4 card p-4 flex flex-wrap items-center gap-3">
          <form method="GET" className="flex items-center gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm theo tên/email/nội dung"
              className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
            />
            <select name="processed" defaultValue={currentProcessed} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent">
              <option value="all">Tất cả</option>
              <option value="true">Đã xử lý</option>
              <option value="false">Chưa xử lý</option>
            </select>
            <button className="btn" type="submit">Lọc</button>
          </form>
          <a href="/admin/contacts" className="btn">Xóa bộ lọc</a>
        </div>

        {items.length === 0 ? (
          <div className="card p-6 mt-6">Không có kết quả phù hợp.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((m) => (
              <div key={m.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs/6 text-foreground/70">{m.email}</div>
                  </div>
                  <div className="text-right text-xs/6 text-foreground/70">
                    {new Date(m.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </div>
                </div>
                <div className="mt-2 text-sm/6">{m.message}</div>
                <AdminContactReply id={m.id} email={m.email} />
                <div className="mt-3 flex items-center gap-2">
                  <form action={async () => toggleProcessed(m.id, !m.processed)}>
                    <button className="btn" type="submit">
                      {m.processed ? "Đánh dấu chưa xử lý" : "Đánh dấu đã xử lý"}
                    </button>
                  </form>
                  <form action={async () => deleteContact(m.id)}>
                    <button className="btn" type="submit">Xóa</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}