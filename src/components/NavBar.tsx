"use client";
import Link from "next/link";
import { useState } from "react";
import {
  MapPinIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const item = (
    href: string,
    label: string,
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ) => (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-black/[.04] dark:hover:bg-white/[.06] transition-colors"
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      <span className="text-sm/6">{label}</span>
    </Link>
  );

  const authArea = () => {
    if (session?.user?.email) {
      const initial = (session.user.name || session.user.email || "U")
        .slice(0, 1)
        .toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-black/[.08] dark:border-white/[.145]"
            aria-label="Tài khoản"
          >
            {initial}
          </Link>
          <button
            className="btn"
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Đăng xuất"
          >
            Đăng xuất
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <Link href="/signin" className="btn">
          Đăng nhập
        </Link>
      </div>
    );
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-background/80 backdrop-blur border-b border-black/[.08] dark:border-white/[.145]">
      <div className="container h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Brand + Desktop nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-block rounded bg-black text-white dark:bg-white dark:text-black px-2 py-1 text-sm">
              TG
            </span>
            TravelGo
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {item("/destinations", "Điểm đến", MapPinIcon)}
            {item("/deals", "Ưu đãi", TagIcon)}
            {item("/#stories", "Câu chuyện", ChatBubbleLeftRightIcon)}
            {item("/about", "Giới thiệu", InformationCircleIcon)}
            {item("/contact", "Liên hệ", EnvelopeIcon)}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/checkout" className="btn" aria-label="Đặt chỗ">
            <CreditCardIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Đặt chỗ
          </Link>
          {authArea()}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center gap-2 rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              Đóng
            </>
          ) : (
            <>
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              Menu
            </>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-black/[.08] dark:border-white/[.145] bg-background">
          <div className="container px-0 py-3 flex flex-col">
            <nav className="flex flex-col">
              {item("/destinations", "Điểm đến", MapPinIcon)}
              {item("/deals", "Ưu đãi", TagIcon)}
              {item("/#stories", "Câu chuyện", ChatBubbleLeftRightIcon)}
              {item("/about", "Giới thiệu", InformationCircleIcon)}
              {item("/contact", "Liên hệ", EnvelopeIcon)}
            </nav>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn"
              >
                <CreditCardIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Đặt chỗ
              </Link>
              {authArea()}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}