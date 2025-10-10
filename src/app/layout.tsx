import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelX — Du lịch thông minh, đặt tour dễ dàng",
  description:
    "Khám phá điểm đến, tour nổi bật và đặt chỗ nhanh chóng với giao diện du lịch đầy đủ tính năng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 sm:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
