import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import AdminDestinationsManager from "@/components/AdminDestinationsManager";

export default async function AdminDestinationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "admin") redirect("/");

  const items = await prisma.destination.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Quản lý điểm đến</h1>
      <p className="text-sm/6 text-foreground/70">Tạo mới, chỉnh sửa và xóa điểm đến.</p>

      <section className="mt-6">
        <AdminDestinationsManager
          initialItems={items.map((d) => ({
            slug: d.slug,
            name: d.name,
            description: d.description,
            image: d.image,
            rating: d.rating,
            price: d.price,
            country: d.country,
            tags: d.tags.split(",").filter(Boolean),
          }))}
        />
      </section>
    </main>
  );
}