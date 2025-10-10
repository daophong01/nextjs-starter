import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold">Quản trị - Đơn đặt chỗ</h1>
      <div className="mt-4 space-y-3">
        {bookings.map((b) => (
          <form
            key={b.id}
            action={`/api/bookings/${b.id}`}
            method="post"
            className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">Mã: {b.id}</div>
              <div className="text-xs text-foreground/60">
                {new Date(b.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-foreground/80 mt-1">
              {b.fullName} • {b.email} • {b.travelers} người • {b.startDate || "linh hoạt"}
            </div>
            <div className="text-sm">Trạng thái: {b.status}</div>
            <div className="text-sm">Số tiền: ${((b.amount || 0) / 100).toFixed(2)} {b.currency}</div>
            <div className="mt-2 flex gap-2">
              <button
                formAction={`/api/bookings/${b.id}`}
                formMethod="post"
                onClick={() => {}}
                className="h-8 px-3 rounded-full bg-green-600 text-white text-xs"
              >
                Đánh dấu đã thanh toán
              </button>
            </div>
          </form>
        ))}
        {bookings.length === 0 && (
          <div className="text-sm text-foreground/60">Chưa có đơn nào.</div>
        )}
      </div>
    </div>
  );
}