"use client";
import { useEffect, useState } from "react";

type Folder = "blog" | "tours" | "destinations" | "avatars";

export default function AdminMediaPage() {
  const [folder, setFolder] = useState<Folder>("blog");
  const [files, setFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const res = await fetch(`/api/uploads?folder=${folder}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch {
      setErr("Không thể tải danh sách.");
    }
  };

  useEffect(() => {
    load();
  }, [folder]);

  const onUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem("file") as HTMLInputElement) || null;
    const f = input?.files?.[0] || null;
    if (!f) return;
    setUploading(true);
    setErr(null);
    setOk(false);
    try {
      const fd = new FormData();
      fd.append("folder", folder);
      fd.append("file", f);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data?.ok) {
        setOk(true);
        await load();
        if (input) input.value = "";
      } else {
        setErr(data?.error || "Upload thất bại.");
      }
    } catch {
      setErr("Không thể kết nối máy chủ.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Quản lý media</h1>
        <p className="text-sm/6 text-foreground/70 mt-1">Thư mục uploads chia theo: blog, tours, destinations, avatars.</p>

        <div className="mt-4 card p-4 grid gap-3 sm:grid-cols-[1fr_2fr]">
          <div>
            <label className="text-xs font-medium">Chọn thư mục</label>
            <select value={folder} onChange={(e) => setFolder(e.target.value as Folder)} className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent">
              <option value="blog">blog</option>
              <option value="tours">tours</option>
              <option value="destinations">destinations</option>
              <option value="avatars">avatars</option>
            </select>

            <form onSubmit={onUpload} className="mt-3 grid gap-2">
              <label className="text-xs font-medium">Tải ảnh lên</label>
              <input type="file" name="file" accept="image/*" className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2 bg-transparent" />
              <button className="btn w-max disabled:opacity-70" disabled={uploading}>{uploading ? "Đang tải..." : "Upload"}</button>
              {ok && <p className="text-xs/6 text-green-700">Đã tải lên.</p>}
              {err && <p className="text-xs/6 text-red-600">{err}</p>}
            </form>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Danh sách ảnh ({folder})</h2>
            {files.length === 0 ? (
              <div className="card p-4">Chưa có ảnh.</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {files.map((f) => (
                  <div key={f.name} className="card overflow-hidden">
                    <img src={f.url} alt={f.name} className="h-32 w-full object-cover" />
                    <div className="p-3 text-xs/6 break-all">{f.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}