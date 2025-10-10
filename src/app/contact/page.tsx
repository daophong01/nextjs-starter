"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="container">
      <section className="mt-10 sm:mt-16">
        <h1 className="text-2xl sm:text-3xl font-bold">Liên hệ</h1>
        <p className="mt-3 text-foreground/80">Có câu hỏi hoặc góp ý? Hãy gửi tin nhắn cho chúng tôi.</p>
      </section>

      <section className="mt-6">
        <form onSubmit={submit} className="card p-4 grid gap-3 max-w-xl">
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
          <button className="rounded-full bg-foreground text-background px-6 py-2 hover:opacity-90 w-max">Gửi</button>
          {sent && <p className="text-xs/6 text-green-700">Đã gửi! Chúng tôi sẽ phản hồi sớm.</p>}
        </form>
      </section>
    </main>
  );
}