import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export default async function AdminContactsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <main className="container mt-16">Unauthorized</main>;
  }
  const me = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!me || me.role !== "admin") {
    return <main className="container mt-16">Forbidden</main>;
  }

  const items = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Liên hệ khách hàng</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">Hiển thị tối đa 200 liên hệ gần nhất.</p>

        {items.length === 0 ? (
          <div className="card p-6 mt-6">Chưa có liên hệ nào.</div>
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