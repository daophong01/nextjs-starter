import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import AdminBookingsManager from "@/components/AdminBookingsManager";

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") redirect("/");

  const items = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Quản lý đơn đặt chỗ</h1>
      <p className="text-sm/6 text-foreground/70">Cập nhật trạng thái, xóa đơn khi cần.</p>

      <section className="mt-6">
        <AdminBookingsManager initialItems={items} />
      </section>
    </main>
  );
}