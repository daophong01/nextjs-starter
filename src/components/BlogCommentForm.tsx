"use client";
import { useState } from "react";

export default function BlogCommentForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOk(false);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, content }),
      });
      const data = await res.json();
      if (res.ok && data?.ok) {
        setOk(true);
        setName("");
        setEmail("");
        setContent("");
      } else {
        setErr(data?.error || "Gửi bình luận thất bại.");
      }
    } catch {
      setErr("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="text-xs font-medium">Tên</label>
      <input value={name} onChange={(e) => setName(e.target.value)} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
      <label className="text-xs font-medium">Email (tùy chọn)</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
      <label className="text-xs font-medium">Nội dung</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent min-h-[100px]" />
      <button className="btn disabled:opacity-70 w-max" disabled={loading || !name || !content}>
        {loading ? "Đang gửi..." : "Gửi bình luận"}
      </button>
      {ok && <p className="text-xs/6 text-green-700">Bình luận đã gửi, chờ duyệt.</p>}
      {err && <p className="text-xs/6 text-red-600">{err}</p>}
    </form>
  );
}