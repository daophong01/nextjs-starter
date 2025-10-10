"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Đăng nhập thất bại. Kiểm tra email/mật khẩu.");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <main className="container">
      <div className="mt-16 max-w-md mx-auto card p-6 animate-soft-pop">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">Sử dụng tài khoản TravelGo hoặc đăng nhập GitHub.</p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <label className="text-xs font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
          {error && <p className="text-xs/6 text-red-600">{error}</p>}
        </form>

        <div className="mt-4">
          <button className="btn" onClick={() => signIn("github")}>Đăng nhập với GitHub</button>
        </div>

        <p className="text-xs/6 mt-4">
          Chưa có tài khoản? <a href="/signup" className="underline">Đăng ký</a>
        </p>
      </div>
    </main>
  );
}