"use client";
import { useState } from "react";

export default function AdminContactReply({ id, email }: { id: string; email: string }) {
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErr(null);
    setOk(false);
    try {
      const res = await fetch("/api/admin/contacts/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email, message: msg }),
      });
      const data = await res.json();
      if (res.ok && data?.ok) {
        setOk(true);
        setMsg("");
      } else {
        setErr(data?.error || "Gửi phản hồi thất bại.");
      }
    } catch {
      setErr("Không thể kết nối máy chủ.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-2 flex items-center gap-2">
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder={`Phản hồi tới ${email}`}
        className="flex-1 rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent"
      />
      <button className="btn" disabled={sending || !msg.trim()}>
        {sending ? "Đang gửi..." : "Gửi phản hồi"}
      </button>
      {ok && <span className="text-xs/6 text-green-700">Đã gửi</span>}
      {err && <span className="text-xs/6 text-red-600">{err}</span>}
    </form>
  );
}