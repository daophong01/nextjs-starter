import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Thanh toán - TravelGo",
  description: "Lịch sử thanh toán.",
};

export default async function AccountPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <main className="container">
        <div className="mt-16 card p-6 text-center">
          <h1 className="text-2xl font-bold">Yêu cầu đăng nhập</h1>
          <p className="text-sm/6 text-foreground/70 mt-2">
            Vui lòng <Link href="/signin" className="underline">đăng nhập</Link> để xem thanh toán.
          </p>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const txs = await prisma.paymentTransaction.findMany({
    where: { userId: user?.id || undefined },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Lịch sử thanh toán</h1>
        {txs.length === 0 ? (
          <div className="card p-6 mt-6 text-center">
            <p className="text-sm/6 text-foreground/70">Chưa có giao dịch.</p>
            <Link href="/destinations" className="btn mt-3">Khám phá điểm đến</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {txs.map((t) => (
              <div key={t.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs/6">{t.id}</div>
                    <div className="text-xs/6 text-foreground/70">
                      {new Date(t.createdAt).toLocaleString()} • {t.paymentMethod?.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm/6">Số tiền: {t.amount} {t.currency}</div>
                    <span className="btn mt-1">{t.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}