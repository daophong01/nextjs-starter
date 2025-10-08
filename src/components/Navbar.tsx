"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/destinations", label: "Điểm đến" },
  { href: "/tours", label: "Tour" },
  { href: "/book", label: "Đặt chỗ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const current = useMemo(() => `${pathname}?${params?.toString() ?? ""}`, [pathname, params]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-lg">
          TravelX
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.href || current.startsWith(l.href + "?");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors hover:text-foreground ${
                  active ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Bắt đầu hành trình
          </Link>
        </div>
      </div>
    </header>
  );
}