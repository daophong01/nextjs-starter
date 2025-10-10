import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/[.08] dark:border-white/[.145] mt-16">
      <div className="container py-8 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-2">
            <span className="inline-block rounded bg-black text-white dark:bg-white dark:text-black px-2 py-1 text-sm">TG</span>
            TravelGo
          </div>
          <p className="text-sm/6 text-foreground/80">
            Nền tảng du lịch giúp bạn khám phá, lên kế hoạch và đặt chỗ cho những hành trình tuyệt vời.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Điều hướng</h3>
          <ul className="text-sm/6 space-y-1">
            <li><Link href="/destinations" className="hover:underline hover:underline-offset-4">Điểm đến</Link></li>
            <li><Link href="/checkout" className="hover:underline hover:underline-offset-4">Đặt chỗ</Link></li>
            <li><Link href="/#deals" className="hover:underline hover:underline-offset-4">Ưu đãi</Link></li>
            <li><Link href="/#stories" className="hover:underline hover:underline-offset-4">Câu chuyện</Link></li>
            <li><Link href="/about" className="hover:underline hover:underline-offset-4">Giới thiệu</Link></li>
            <li><Link href="/contact" className="hover:underline hover:underline-offset-4">Liên hệ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Liên hệ</h3>
          <ul className="text-sm/6 space-y-1">
            <li>Email: support@travelgo.example</li>
            <li>Hotline: 1900 1234</li>
            <li>Địa chỉ: 123 Trần Phú, Hà Nội</li>
          </ul>
        </div>
      </div>
      <div className="container py-4 text-xs/6 text-center text-foreground/60">
        © {new Date().getFullYear()} TravelGo. All rights reserved.
      </div>
    </footer>
  );
}