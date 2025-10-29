"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Gửi liên hệ thất bại.");
      }
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <section className="mt-10 sm:mt-16 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Liên hệ</h1>
          <p className="mt-3 text-foreground/80">Có câu hỏi hoặc góp ý? Hãy gửi tin nhắn cho chúng tôi.</p>

          <form onSubmit={submit} className="mt-6 card p-4 grid gap-3 max-w-xl">
            <label className="text-xs font-medium">Tên</label>
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
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
            />
            <label className="text-xs font-medium">Tin nhắn</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent min-h-[100px]"
            />
            <button className="rounded-full bg-foreground text-background px-6 py-2 hover:opacity-90 w-max disabled:opacity-70" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
            {sent && <p className="text-xs/6 text-green-700">Đã gửi! Chúng tôi sẽ phản hồi sớm.</p>}
            {error && <p className="text-xs/6 text-red-600">{error}</p>}
          </form>
        </div>

        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Thông tin liên hệ</h2>
          <div className="text-sm/6">
            <div>Email: support@travelgo.example</div>
            <div>Hotline: 1900 123 456</div>
            <div>Địa chỉ: 123 Đường Trải Nghiệm, Quận 1, TP. HCM</div>
          </div>
          <div className="mt-3">
            <iframe
              title="Map"
              src="https://www.google.com/maps?q=Ho+Chi+Minh+City&output=embed"
              className="w-full h-48 rounded border border-black/[.08] dark:border-white/[.145]"
            />
          </div>
          <p className="text-xs/6 text-foreground/60 mt-2">Vui lòng hẹn lịch trước khi ghé thăm văn phòng.</p>
        </aside>
      </section>
    </main>
  );
}