"use client";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-black/[.08] dark:border-white/[.145] bg-background text-foreground">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-block rounded bg-black text-white dark:bg-white dark:text-black px-2 py-1 text-sm">TG</span>
          TravelGo
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/destinations" className="hover:underline hover:underline-offset-4">Điểm đến</Link>
          <Link href="/#deals" className="hover:underline hover:underline-offset-4">Ưu đãi</Link>
          <Link href="/#stories" className="hover:underline hover:underline-offset-4">Câu chuyện</Link>
          <Link href="/about" className="hover:underline hover:underline-offset-4">Giới thiệu</Link>
          <Link href="/contact" className="hover:underline hover:underline-offset-4">Liên hệ</Link>
          <Link href="/checkout" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]">Đặt chỗ</Link>
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/[.08] dark:border-white/[.145]">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link href="/destinations" onClick={() => setOpen(false)} className="py-1">Điểm đến</Link>
            <Link href="/#deals" onClick={() => setOpen(false)} className="py-1">Ưu đãi</Link>
            <Link href="/#stories" onClick={() => setOpen(false)} className="py-1">Câu chuyện</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="py-1">Giới thiệu</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="py-1">Liên hệ</Link>
            <Link href="/checkout" onClick={() => setOpen(false)} className="py-1">Đặt chỗ</Link>
          </div>
        </div>
      )}
    </header>
  );
}