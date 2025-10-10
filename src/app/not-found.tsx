import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container">
      <div className="mt-16 card p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">404 - Không tìm thấy trang</h1>
        <p className="mt-2 text-sm/6 text-foreground/70">
          Trang bạn truy cập không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-4">
          <Link href="/" className="underline">← Về trang chủ</Link>
        </div>
      </div>
    </main>
  );
}