"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    if (res?.error) setErr(res.error);
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl border border-black/5 dark:border-white/10">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div>
          <label className="text-sm">Email</label>
          <input
            className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Mật khẩu</label>
          <input
            className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none"
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
      <div className="text-sm text-foreground/70 mt-3">
        Chưa có tài khoản? <Link href="/signup" className="text-blue-600">Đăng ký</Link>
      </div>
    </div>
  );
}