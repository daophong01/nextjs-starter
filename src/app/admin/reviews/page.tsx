import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import AdminReviewsManager from "@/components/AdminReviewsManager";

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") redirect("/");

  const items = await prisma.review.findMany({ orderBy: { date: "desc" } });

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Quản lý đánh giá</h1>
      <p className="text-sm/6 text-foreground/70">Xóa các đánh giá không phù hợp.</p>

      <section className="mt-6">
        <AdminReviewsManager initialItems={items} />
      </section>
    </main>
  );
}