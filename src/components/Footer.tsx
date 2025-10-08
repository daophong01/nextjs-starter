import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10 mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div className="space-y-2">
          <div className="font-semibold">TravelX</div>
          <p className="text-foreground/70">
            Nền tảng đặt tour và khám phá điểm đến trên khắp thế giới.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">Khám phá</div>
          <ul className="space-y-1 text-foreground/70">
            <li><Link href="/destinations" className="hover:text-foreground">Điểm đến</Link></li>
            <li><Link href="/tours" className="hover:text-foreground">Tour nổi bật</Link></li>
            <li><Link href="/book" className="hover:text-foreground">Đặt chỗ</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Liên hệ</div>
          <ul className="space-y-1 text-foreground/70">
            <li>Email: hello@travelx.example</li>
            <li>Hotline: 0123 456 789</li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-foreground/60">
        © {new Date().getFullYear()} TravelX. All rights reserved.
      </div>
    </footer>
  );
}