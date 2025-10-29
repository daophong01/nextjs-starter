"use client";
import { useEffect, useRef, useState } from "react";

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; message: string; createdAt: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.items || []);
      // scroll to bottom
      setTimeout(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
      }, 100);
    } catch {}
  };

  useEffect(() => {
    if (!open) return;
    fetchMessages();
    const t = setInterval(fetchMessages, 10000);
    return () => clearInterval(t);
  }, [open]);

  const send = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });
      if (res.ok) {
        setInput("");
        fetchMessages();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button className="btn btn-primary" onClick={() => setOpen(true)}>Chat hỗ trợ</button>
      ) : (
        <div className="w-[320px] rounded-2xl border border-black/[.08] dark:border-white/[.145] bg-background shadow-lg">
          <div className="p-3 border-b border-black/[.08] dark:border-white/[.145] flex items-center justify-between">
            <div className="font-semibold">Hỗ trợ khách hàng</div>
            <button className="btn" onClick={() => setOpen(false)}>Đóng</button>
          </div>
          <div ref={listRef} className="p-3 h-52 overflow-y-auto">
            {messages.length === 0 && <div className="text-sm/6 text-foreground/60">Chưa có tin nhắn.</div>}
            {messages.slice().reverse().map((m) => (
              <div key={m.id} className="mb-2">
                <div className="text-xs/6 text-foreground/60">{new Date(m.createdAt).toLocaleString()}</div>
                <div className="text-sm/6">{m.message}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-black/[.08] dark:border-white/[.145]">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent flex-1"
              />
              <button className="btn btn-primary disabled:opacity-70" onClick={send} disabled={loading || !input.trim()}>
                Gửi
              </button>
            </div>
            <div className="text-[11px] text-foreground/60 mt-1">Đăng nhập để sử dụng chat hỗ trợ.</div>
          </div>
        </div>
      )}
    </div>
  );
}