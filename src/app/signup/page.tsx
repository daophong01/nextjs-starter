"use client";
import { useState } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Đăng ký thất bại");
      }
      setOk(true);
      setTimeout(() => (window.location.href = "/signin"), 1000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="mt-16 max-w-md mx-auto card p-6 animate-soft-pop">
        <h1 className="text-2xl font-bold">Đăng ký</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">Tạo tài khoản TravelGo.</p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <label className="text-xs font-medium">Tên hiển thị</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
          />

          <label className="text-xs font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
          />

          <label className="text-xs font-medium">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
          />

          <button className="btn btn-primary disabled:opacity-70" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
          {ok && <p className="text-xs/6 text-green-700">Đăng ký thành công! Đang chuyển tới trang đăng nhập...</p>}
          {error && <p className="text-xs/6 text-red-600">{error}</p>}
        </form>

        <p className="text-xs/6 mt-4">
          Đã có tài khoản? <a href="/signin" className="underline">Đăng nhập</a>
        </p>
      </div>
    </main>
  );
}