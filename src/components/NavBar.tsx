"use client";
import Link from "next/link";
import { useState } from "react";
import { MapPinIcon, TagIcon, ChatBubbleLeftRightIcon, InformationCircleIcon, EnvelopeIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const item = (href: string, label: string, Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>) => (
    <Link href={href} className="hover:underline hover:underline-offset-4 flex items-center gap-1.5">
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {label}
    </Link>
  );

  const authArea = () => {
    if (session?.user?.email) {
      const initial = (session.user.name || session.user.email || "U").slice(0, 1).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-black/[.08] dark:border-white/[.145]">{initial}</span>
          <button className="btn" onClick={() => signOut({ callbackUrl: "/" })}>Đăng xuất</button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <Link href="/signin" className="btn">Đăng nhập</Link>
        <Link href="/signup" className="btn">Đăng ký</Link>
      </div>
    );
  };

  return (
    <header className="w-full border-b border-black/[.08] dark:border-white/[.145] bg-background text-foreground">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-block rounded bg-black text-white dark:bg-white dark:text-black px-2 py-1 text-sm">TG</span>
          TravelGo
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {item("/destinations", "Điểm đến", MapPinIcon)}
          {item("/deals", "Ưu đãi", TagIcon)}
          {item("/#stories", "Câu chuyện", ChatBubbleLeftRightIcon)}
          {item("/about", "Giới thiệu", InformationCircleIcon)}
          {item("/contact", "Liên hệ", EnvelopeIcon)}
          <Link href="/checkout" className="btn">
            <CreditCardIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Đặt chỗ
          </Link>
          {authArea()}
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
            {item("/destinations", "Điểm đến", MapPinIcon)}
            {item("/deals", "Ưu đãi", TagIcon)}
            {item("/#stories", "Câu chuyện", ChatBubbleLeftRightIcon)}
            {item("/about", "Giới thiệu", InformationCircleIcon)}
            {item("/contact", "Liên hệ", EnvelopeIcon)}
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn">
              <CreditCardIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Đặt chỗ
            </Link>
            <div className="mt-2">{authArea()}</div>
          </div>
        </div>
      )}
    </header>
  );
}