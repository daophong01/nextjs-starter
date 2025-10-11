"use client";
import { useEffect, useState } from "react";

export default function VerifyPage({
  searchParams,
}: {
  searchParams?: { token?: string; email?: string };
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "loading">("idle");

  useEffect(() => {
    const token = searchParams?.token || "";
    const email = (searchParams?.email || "").toLowerCase();
    if (!token || !email) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        setStatus("ok");
        setTimeout(() => (window.location.href = "/signin"), 1500);
      })
      .catch(() => setStatus("error"));
  }, [searchParams?.token, searchParams?.email]);

  return (
    <main className="container">
      <div className="mt-16 max-w-md mx-auto card p-6 animate-soft-pop text-center">
        <h1 className="text-2xl font-bold">Xác thực email</h1>
        {status === "loading" && <p className="text-sm/6 text-foreground/70 mt-2">Đang xác thực...</p>}
        {status === "ok" && <p className="text-sm/6 text-green-700 mt-2">Xác thực thành công! Đang chuyển tới đăng nhập...</p>}
        {status === "error" && (
          <p className="text-sm/6 text-red-600 mt-2">
            Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại từ trang “Quên mật khẩu” hoặc đăng ký lại.
          </p>
        )}
      </div>
    </main>
  );
}