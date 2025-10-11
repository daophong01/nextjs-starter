"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
    if (!siteKey) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.body.appendChild(script);
    const render = () => {
      if (!window.turnstile) return;
      window.turnstile.render("#captcha", {
        sitekey: siteKey,
        callback: (token: string) => setCaptchaToken(token),
      });
    };
    script.onload = render;
    const t = setTimeout(render, 1000);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: captchaToken }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Gửi yêu cầu thất bại");
      }
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="mt-16 max-w-md mx-auto card p-6 animate-soft-pop">
        <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">Nhập email để nhận liên kết đặt lại mật khẩu.</p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <label className="text-xs font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
          />

          <div id="captcha" className="mt-2" />

          <button className="btn btn-primary disabled:opacity-70" disabled={loading || !email}>
            {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
          </button>
          {sent && <p className="text-xs/6 text-green-700">Nếu email tồn tại, liên kết đặt lại đã được gửi.</p>}
          {error && <p className="text-xs/6 text-red-600">{error}</p>}
        </form>

        <p className="text-xs/6 mt-4">
          <a href="/signin" className="underline">Quay lại đăng nhập</a>
        </p>
      </div>
    </main>
  );
}