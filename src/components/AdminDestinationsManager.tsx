"use client";
import { useState } from "react";

type DestinationItem = {
  slug: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  country: string;
  tags: string[];
};

export default function AdminDestinationsManager({ initialItems }: { initialItems: DestinationItem[] }) {
  const [items, setItems] = useState<DestinationItem[]>(initialItems);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<DestinationItem>({
    slug: "",
    name: "",
    description: "",
    image: "",
    rating: 4.5,
    price: 100,
    country: "",
    tags: [],
  });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      slug: "",
      name: "",
      description: "",
      image: "",
      rating: 4.5,
      price: 100,
      country: "",
      tags: [],
    });
  };

  const toCSV = (arr: string[]) => arr.join(",");
  const fromCSV = (s: string) => s.split(",").map((t) => t.trim()).filter(Boolean);

  const createDestination = async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Tạo điểm đến thất bại");
      }
      const created = await res.json();
      const newItem: DestinationItem = {
        slug: created.slug,
        name: created.name,
        description: created.description,
        image: created.image,
        rating: created.rating,
        price: created.price,
        country: created.country,
        tags: fromCSV(created.tags || ""),
      };
      setItems((prev) => [newItem, ...prev]);
      resetForm();
      setCreating(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const updateDestination = async (slug: string, data: Partial<DestinationItem>) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          ...data,
          tags: data.tags ? toCSV(data.tags) : undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Cập nhật thất bại");
      }
      const updated = await res.json();
      setItems((prev) =>
        prev.map((it) =>
          it.slug === slug
            ? {
                slug: updated.slug,
                name: updated.name,
                description: updated.description,
                image: updated.image,
                rating: updated.rating,
                price: updated.price,
                country: updated.country,
                tags: fromCSV(updated.tags || ""),
              }
            : it
        )
      );
      setEditingSlug(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteDestination = async (slug: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/destinations?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Xóa thất bại");
      }
      setItems((prev) => prev.filter((it) => it.slug !== slug));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const EditableRow = ({ it }: { it: DestinationItem }) => {
    const [local, setLocal] = useState<DestinationItem>(it);
    return (
      <tr className="border-t">
        <td className="p-2 font-mono text-xs/6">{it.slug}</td>
        <td className="p-2">
          <input
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-2 py-1"
            value={local.name}
            onChange={(e) => setLocal({ ...local, name: e.target.value })}
          />
        </td>
        <td className="p-2">
          <input
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-2 py-1"
            value={local.country}
            onChange={(e) => setLocal({ ...local, country: e.target.value })}
          />
        </td>
        <td className="p-2">
          <input
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-2 py-1"
            value={local.image}
            onChange={(e) => setLocal({ ...local, image: e.target.value })}
          />
        </td>
        <td className="p-2">
          <input
            type="number"
            className="w-24 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-2 py-1"
            value={local.price}
            onChange={(e) => setLocal({ ...local, price: Number(e.target.value) })}
          />
        </td>
        <td className="p-2">
          <input
            type="number"
            step="0.1"
            className="w-20 rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-2 py-1"
            value={local.rating}
            onChange={(e) => setLocal({ ...local, rating: Number(e.target.value) })}
          />
        </td>
        <td className="p-2">
          <input
            className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-2 py-1"
            value={local.tags.join(",")}
            onChange={(e) => setLocal({ ...local, tags: fromCSV(e.target.value) })}
          />
        </td>
        <td className="p-2 text-right">
          <button className="btn btn-primary mr-2" onClick={() => updateDestination(it.slug, local)}>
            Lưu
          </button>
          <button className="btn" onClick={() => setEditingSlug(null)}>
            Hủy
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="card p-4 animate-soft-pop">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Danh sách điểm đến</h2>
        <button className="btn btn-primary" onClick={() => setCreating((v) => !v)}>
          {creating ? "Đóng form" : "Tạo mới"}
        </button>
      </div>

      {error && <p className="text-xs/6 text-red-600 mt-2">{error}</p>}

      {creating && (
        <div className="mt-4 grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Tên</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Ảnh (URL)</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Quốc gia</label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Giá</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Rating</label>
              <input
                type="number"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium">Tags (comma)</label>
              <input
                value={form.tags.join(",")}
                onChange={(e) => setForm({ ...form, tags: fromCSV(e.target.value) })}
                className="w-full rounded border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={createDestination}>Tạo</button>
            <button className="btn" onClick={() => { setCreating(false); resetForm(); }}>Hủy</button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Slug</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Quốc gia</th>
              <th className="p-2">Ảnh</th>
              <th className="p-2">Giá</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Tags</th>
              <th className="p-2 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) =>
              editingSlug === it.slug ? (
                <EditableRow key={it.slug} it={it} />
              ) : (
                <tr key={it.slug} className="border-t">
                  <td className="p-2 font-mono text-xs/6">{it.slug}</td>
                  <td className="p-2">{it.name}</td>
                  <td className="p-2">{it.country}</td>
                  <td className="p-2 truncate max-w-[240px]">{it.image}</td>
                  <td className="p-2">${it.price}</td>
                  <td className="p-2">⭐ {it.rating}</td>
                  <td className="p-2">{it.tags.join(", ")}</td>
                  <td className="p-2 text-right">
                    <button className="btn mr-2" onClick={() => setEditingSlug(it.slug)}>Sửa</button>
                    <button className="btn" onClick={() => deleteDestination(it.slug)}>Xóa</button>
                  </td>
                </tr>
              )
            )}
            {items.length === 0 && (
              <tr>
                <td className="p-4" colSpan={8}>Chưa có điểm đến.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}