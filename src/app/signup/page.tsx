"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Đăng ký thất bại");
      router.push("/signin");
    } catch (e: any) {
      setErr(e.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl border border-black/5 dark:border-white/10">
      <h1 className="text-2xl font-semibold">Đăng ký</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div>
          <label className="text-sm">Họ tên</label>
          <input className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Mật khẩu</label>
          <input className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}
          className="w-full h-10 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-60">
          {loading ? "Đang xử lý..." : "Tạo tài khoản"}
        </button>
      </form>
      <div className="text-sm text-foreground/70 mt-3">
        Đã có tài khoản? <Link href="/signin" className="text-blue-600">Đăng nhập</Link>
      </div>
    </div>
  );
}