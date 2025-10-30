import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";
import { Routes, Route, Link, useParams, useSearchParams, useNavigate } from "https://esm.sh/react-router-dom@6.22.3";

const API = "";
const getToken = () => localStorage.getItem("token") || "";
const setToken = (t) => localStorage.setItem("token", t);

// Simple components
const Button = (props) => <button {...props} className={`btn ${props.className || ""}`}>{props.children}</button>;
const Card = ({ children, className }) => <div className={`card ${className || ""}`}>{children}</div>;
const Badge = ({ children, className }) => <span className={`badge ${className || ""}`}>{children}</span>;
const Input = (props) => <input {...props} className={`input ${props.className || ""}`} />;
const Select = (props) => <select {...props} className={`select ${props.className || ""}`} />;

function Pagination({ page, pages, onGo }) {
  const items = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) items.push(i);
  return (
    <div className="pagination mt-4">
      <button disabled={page<=1} onClick={()=>onGo(page-1)}>←</button>
      {start>1 && (<><button onClick={()=>onGo(1)}>1</button><span>…</span></>)}
      {items.map(i=> <button key={i} onClick={()=>onGo(i)} className={i===page?"active":""}>{i}</button>)}
      {end<pages && (<><span>…</span><button onClick={()=>onGo(pages)}>{pages}</button></>)}
      <button disabled={page>=pages} onClick={()=>onGo(page+1)}>→</button>
    </div>
  );
}

// NavBar
function NavBar() {
  const nav = useNavigate();
  const [tokenPresent, setTokenPresent] = useState(!!getToken());
  useEffect(() => {
    const i = setInterval(() => setTokenPresent(!!getToken()), 500);
    return () => clearInterval(i);
  }, []);
  return (
    <nav className="border-b border-black/10">
      <div className="container py-3 flex items-center justify-between">
        <Link to="/" className="font-bold">TravelGo</Link>
        <div className="flex items-center gap-3">
          <Link className="btn" to="/destinations">Destinations</Link>
          <Link className="btn" to="/tours">Tours</Link>
          <Link className="btn" to="/deals">Deals</Link>
          <Link className="btn" to="/blog">Blog</Link>
          <Link className="btn" to="/account">Account</Link>
          <Link className="btn" to="/admin">Admin</Link>
          {tokenPresent ? (
            <Button onClick={()=>{ localStorage.removeItem("token"); setTokenPresent(false); nav("/"); }}>Logout</Button>
          ) : (
            <Link className="btn" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// Home
function Home() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Khám phá thế giới theo cách của bạn</h1>
        <p className="text-sm mt-2 text-black/70">Tìm điểm đến yêu thích, xem gợi ý và đặt chỗ nhanh chóng.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/destinations" className="btn btn-primary">Destinations</Link>
          <Link to="/tours" className="btn">Tours</Link>
          <Link to="/deals" className="btn">Deals</Link>
          <Link to="/blog" className="btn">Blog</Link>
        </div>
      </section>
    </main>
  );
}

// Destinations
function DestinationsAdmin({ token }) {
  const [items, setItems] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type":"application/json", "x-csrf-token": token } : { "Content-Type":"application/json" };

  const load = async () => {
    const res = await fetch("/api/admin/destinations", { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()).catch(()=>({ items: [] }));
    setItems(res.items || []);
  };
  useEffect(()=>{ load(); }, []);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("folder", "destinations");
    fd.append("file", file);
    const res = await fetch("/api/uploads", { method:"POST", body: fd });
    const data = await res.json();
    if (res.ok && data?.ok) return data.url;
    return "";
  };

  const create = async (e) => {
    e.preventDefault();
    setToast("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    if (!body.slug || !body.name) { setToast("Slug và Name là bắt buộc"); return; }
    body.rating = Number(body.rating || 0);
    body.price = Number(body.price || 0);
    body.tags = (body.tags || "").split(",").map(s=>s.trim()).filter(Boolean);
    const imageFile = fd.get("imageFile");
    if (imageFile && imageFile.size) {
      const url = await uploadImage(imageFile);
      if (url) body.image = url;
    }
    const res = await fetch("/api/admin/destinations", { method:"POST", headers, body: JSON.stringify(body) });
    if (res.ok) { setShowCreate(false); e.currentTarget.reset(); load(); setToast("Tạo thành công"); } else setToast("Tạo thất bại");
  };

  const update = async (e) => {
    e.preventDefault();
    setToast("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    body.id = editing.id;
    body.rating = Number(body.rating || editing.rating || 0);
    body.price = Number(body.price || editing.price || 0);
    body.tags = (body.tags || editing.tags || "").split(",").map(s=>s.trim()).filter(Boolean);
    const imageFile = fd.get("imageFile");
    if (imageFile && imageFile.size) {
      const url = await uploadImage(imageFile);
      if (url) body.image = url;
    }
    const res = await fetch("/api/admin/destinations", { method:"PATCH", headers, body: JSON.stringify(body) });
    if (res.ok) { setEditing(null); load(); setToast("Cập nhật thành công"); } else setToast("Cập nhật thất bại");
  };

  const remove = async (id) => {
    if (!confirm("Xóa điểm đến này?")) return;
    await fetch(`/api/admin/destinations?id=${encodeURIComponent(id)}`, { method:"DELETE", headers: { Authorization: `Bearer ${token}`, "x-csrf-token": token } });
    load();
    setToast("Đã xóa");
  };

  return (
    <div>
      {toast && <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-2 rounded">{toast}</div>}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Destinations</h2>
        <Button className="btn-primary" onClick={()=>setShowCreate(true)}>Create</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mt-4">
        {items.map(d=> (
          <Card key={d.id} className="p-3">
            <div className="font-semibold">{d.name}</div>
            <div className="text-xs text-black/60">{d.country}</div>
            <div className="mt-2 flex items-center gap-2">
              <Button onClick={()=>setEditing(d)}>Edit</Button>
              <Button onClick={()=>remove(d.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {items.length===0 && <Card className="p-4">No data.</Card>}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <Card className="p-4 w-full max-w-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Create Destination</h3>
              <Button onClick={()=>setShowCreate(false)}>Close</Button>
            </div>
            <form className="grid gap-2 mt-3" onSubmit={create}>
              <Input name="slug" placeholder="slug" required />
              <Input name="name" placeholder="name" required />
              <Input name="country" placeholder="country" />
              <Input name="image" placeholder="image url" />
              <input name="imageFile" type="file" accept="image/*" />
              <Input name="price" placeholder="price" type="number" />
              <Input name="rating" placeholder="rating" type="number" step="0.1" />
              <Input name="tags" placeholder="tags (comma separated)" />
              <textarea name="description" placeholder="description" className="input min-h-[80px]"></textarea>
              <Button className="btn-primary" type="submit">Create</Button>
            </form>
          </Card>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <Card className="p-4 w-full max-w-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Edit Destination</h3>
              <Button onClick={()=>setEditing(null)}>Close</Button>
            </div>
            <form className="grid gap-2 mt-3" onSubmit={update}>
              <Input name="slug" placeholder="slug" defaultValue={editing.slug} required />
              <Input name="name" placeholder="name" defaultValue={editing.name} required />
              <Input name="country" placeholder="country" defaultValue={editing.country} />
              <Input name="image" placeholder="image url" defaultValue={editing.image} />
              <input name="imageFile" type="file" accept="image/*" />
              <Input name="price" placeholder="price" type="number" defaultValue={editing.price} />
              <Input name="rating" placeholder="rating" type="number" step="0.1" defaultValue={editing.rating} />
              <Input name="tags" placeholder="tags (comma separated)" defaultValue={editing.tags} />
              <textarea name="description" placeholder="description" className="input min-h-[80px]" defaultValue={editing.description}></textarea>
              <Button className="btn-primary" type="submit">Save</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    fetch(`/api/destinations`).then(r => r.json()).then(data => setItems(data.items || [])).catch(() => setItems([]));
  }, []);
  const filtered = items.filter(d =>
    !q || (d.name || "").toLowerCase().includes(q.toLowerCase())
  );
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Destinations</h1>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="mt-3"/>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(d => (
          <Link key={d.slug} to={`/destinations/${d.slug}`} className="card overflow-hidden">
            <img src={d.image} alt={d.name} className="h-40 w-full object-cover"/>
            <div className="p-3">
              <div className="font-semibold">{d.name} <Badge className="ml-2">{d.country}</Badge></div>
              <span className="text-sm underline mt-2 inline-block">Xem chi tiết →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <Card className="p-4">No destinations.</Card>}
      </div>
    </main>
  );
}

function DestinationDetail() {
  const { slug } = useParams();
  const [d, setD] = useState(null);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch(`/api/destinations/${slug}`).then(r => r.json()).then(setD).catch(()=>setD(null));
    fetch(`/api/reviews?slug=${encodeURIComponent(slug)}`).then(r=>r.json()).then(data=>setReviews(data.items||[])).catch(()=>setReviews([]));
  }, [slug]);
  if (!d) return <main className="container mt-8"><Card className="p-4">Not found</Card></main>;
  return (
    <main className="container">
      <div className="mt-8 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden">
          <img src={d.image} alt={d.name} className="h-64 w-full object-cover"/>
          <div className="p-4">
            <h1 className="text-2xl font-bold">{d.name}</h1>
            <p className="text-sm text-black/70 mt-1">{d.description}</p>
            <div className="mt-3 text-sm flex items-center gap-3">
              <span>⭐ {d.rating}</span>
              <span>From ${d.price}</span>
              <Badge>{d.country}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-4 h-max">
          <h2 className="font-semibold mb-2">Đặt chỗ nhanh</h2>
          <Link to={`/checkout?destination=${encodeURIComponent(slug)}&guests=2`} className="btn btn-primary">Book now</Link>
        </Card>
      </div>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Bản đồ</h2>
          <iframe title="Map" src={`https://www.google.com/maps?q=${encodeURIComponent(d.name + ", " + d.country)}&output=embed`} className="w-full h-64 rounded border"/>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Đánh giá</h2>
          {reviews.length === 0 ? <p className="text-sm text-black/70">Chưa có đánh giá.</p> : (
            <div className="grid gap-2">
              {reviews.map(r => (
                <div key={r.id} className="rounded border border-black/10 p-2">
                  <div className="text-xs text-black/60">{new Date(r.date).toLocaleString()}</div>
                  <div className="font-semibold">{r.author}</div>
                  <div className="text-sm">{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}

// Tours
function Tours() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  useEffect(()=>{ fetch(`/api/tours`).then(r=>r.json()).then(data=>setItems(data.items||[])).catch(()=>setItems([])); },[]);
  const filtered = items.filter(t => !q || (t.name || "").toLowerCase().includes(q.toLowerCase()));
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Tours</h1>
      <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search tours..." className="mt-3"/>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(t => (
          <Link key={t.slug} to={`/tours/${t.slug}`} className="card overflow-hidden">
            <img src={t.image} alt={t.name} className="h-40 w-full object-cover"/>
            <div className="p-3">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-black/70">{t.fromCity} → {t.destination} • {t.days}N</div>
              <span className="text-sm underline mt-2 inline-block">Chi tiết →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <Card className="p-4">No tours.</Card>}
      </div>
    </main>
  );
}

function TourDetail() {
  const { slug } = useParams();
  const [t, setT] = useState(null);
  useEffect(()=>{ fetch(`/api/tours/${slug}`).then(r=>r.json()).then(setT).catch(()=>setT(null)); },[slug]);
  if (!t) return <main className="container mt-8"><Card className="p-4">Not found</Card></main>;
  return (
    <main className="container">
      <section className="mt-8 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden">
          <img src={t.image} alt={t.name} className="h-64 w-full object-cover"/>
          <div className="p-4">
            <h1 className="text-2xl font-bold">{t.name}</h1>
            <p className="text-sm text-black/70">{t.fromCity} → {t.destination} • {t.days}N • {t.transport}</p>
            <div className="mt-3 text-sm flex items-center gap-3">
              <span>From ${t.price}</span>
              <span>⭐ {t.rating}</span>
            </div>

            <h2 className="font-semibold mt-4 mb-2">Lịch trình</h2>
            <div className="grid gap-2">
              {t.schedule.map(s => (
                <div key={s.day} className="rounded border border-black/10 p-2">
                  <div className="font-semibold">Ngày {s.day}: {s.title}</div>
                  <div className="text-sm text-black/70">{s.details}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-4 h-max">
          <h2 className="font-semibold mb-2">Đặt tour</h2>
          <Link to={`/checkout?tour=${encodeURIComponent(slug)}&tourName=${encodeURIComponent(t.name)}&guests=2`} className="btn btn-primary">Đặt ngay</Link>
        </Card>
      </section>
    </main>
  );
}

// Deals
function Deals() {
  const [items, setItems] = useState([]);
  const [off, setOff] = useState(10);
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [couponInfo, setCouponInfo] = useState(null);
  const [perItemDiscount, setPerItemDiscount] = useState({}); // {slug: {discount, percent, type}}

  useEffect(()=>{ fetch(`/api/destinations`).then(r=>r.json()).then(data=>setItems(data.items||[])).catch(()=>setItems([])); },[]);
  const dealsBase = items.filter(d=> (d.tags||[]).includes?.("beach") || (d.tags||[]).includes?.("city"));

  const applyCode = async () => {
    if (!code) return;
    setApplying(true);
    try {
      const map = {};
      for (const d of dealsBase) {
        const res = await fetch("/api/coupons", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ code, amount: d.price }) });
        const data = await res.json();
        if (res.ok && data.valid) {
          map[d.slug] = { discount: data.discount, percent: data.percent || Math.round((data.discount / d.price) * 100), type: data.type || "percentage" };
        } else {
          map[d.slug] = { discount: 0, percent: 0, type: "percentage" };
        }
      }
      setPerItemDiscount(map);
      // For UI badge, use average percent from first item if exists
      const first = dealsBase[0];
      const p = first ? (map[first.slug]?.percent || off) : off;
      setCouponInfo({ percent: p, type: map[first?.slug || ""]?.type || "percentage" });
    } catch {
      setCouponInfo(null);
      setPerItemDiscount({});
    } finally {
      setApplying(false);
    }
  };

  const computeDealPrice = (price, slug) => {
    if (code && perItemDiscount[slug]) {
      const info = perItemDiscount[slug];
      if (info.type === "percentage") {
        return Math.max(0, Math.round(price * (1 - (info.percent || 0)/100)));
      } else {
        return Math.max(0, price - (info.discount || 0));
      }
    }
    return Math.max(0, Math.round(price * (1 - off/100)));
  };

  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Deals</h1>
      <div className="mt-3 flex items-center gap-2">
        <Select value={off} onChange={(e)=>{ setCouponInfo(null); setPerItemDiscount({}); setOff(Number(e.target.value)); }}>
          <option value={10}>-10%</option>
          <option value={15}>-15%</option>
          <option value={20}>-20%</option>
        </Select>
        <Badge>Ưu đãi -{couponInfo?.percent || off}%</Badge>
        <Input value={code} onChange={(e)=>setCode(e.target.value.toUpperCase())} placeholder="Mã coupon (VD: SAVE10)" />
        <Button onClick={applyCode} className="btn-primary" disabled={applying || !code}>{applying? "Đang áp dụng..." : "Áp dụng mã"}</Button>
      </div>
      {couponInfo && <p className="text-xs text-black/70 mt-1">Mã hợp lệ • Đã áp dụng cho từng điểm đến.</p>}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dealsBase.map(d=> {
          const dp = computeDealPrice(d.price, d.slug);
          const percentBadge = code && perItemDiscount[d.slug] ? perItemDiscount[d.slug].percent : (couponInfo?.percent || off);
          return (
            <Card key={d.slug} className="overflow-hidden">
              <img src={d.image} alt={d.name} className="h-40 w-full object-cover"/>
              <div className="p-3">
                <div className="font-semibold">{d.name} <Badge className="ml-2">-{percentBadge}%</Badge></div>
                <div className="mt-2 text-sm">
                  <span className="font-mono">${dp}</span>
                  <span className="ml-2 line-through opacity-60">${d.price}</span>
                </div>
                <Link to={`/destinations/${d.slug}`} className="text-sm underline mt-2 inline-block">Xem chi tiết →</Link>
              </div>
            </Card>
          );
        })}
        {dealsBase.length===0 && <Card className="p-4">Chưa có ưu đãi phù hợp.</Card>}
      </div>
    </main>
  );
}

// Account (profile/bookings/reviews) via email lookup
function Account() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const lookup = async () => {
    setBookings([]); setReviews([]);
    if (!email) return;
    try {
      const bs = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`).then(r=>r.json()).catch(()=>[]);
      const rs = await fetch(`/api/reviews?email=${encodeURIComponent(email)}`).then(r=>r.json()).then(d=>d.items||[]).catch(()=>[]);
      setBookings(bs||[]); setReviews(rs||[]);
    } catch {}
  };
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Tài khoản</h1>
      <Card className="p-4 mt-4 max-w-lg">
        <div className="grid gap-2">
          <Input placeholder="Nhập email để tra cứu" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <Button className="btn-primary" onClick={lookup}>Tra cứu</Button>
        </div>
      </Card>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Đặt chỗ</h2>
          {bookings.length===0 ? <p className="text-sm text-black/70">Chưa có đặt chỗ.</p> : (
            <div className="grid gap-2">
              {bookings.map(b=> (
                <div key={b.id} className="rounded border border-black/10 p-2">
                  <div className="text-xs text-black/60">{new Date(b.createdAt).toLocaleString()}</div>
                  <div className="text-sm">Destination/Tour: {b.destination || b.tourName || "-"}</div>
                  <div className="text-sm">Guests: {b.guests} • Status: {b.status}</div>
                  <div className="text-sm">Total: ${b.totalAmount || b.price}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Đánh giá</h2>
          {reviews.length===0 ? <p className="text-sm text-black/70">Chưa có đánh giá.</p> : (
            <div className="grid gap-2">
              {reviews.map(r=> (
                <div key={r.id} className="rounded border border-black/10 p-2">
                  <div className="text-xs text-black/60">{new Date(r.date).toLocaleString()}</div>
                  <div className="text-sm">Slug: {r.slug}</div>
                  <div className="text-sm">⭐ {r.rating}</div>
                  <div className="text-sm">{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}

// Admin SPA basic panels (read-only / simple actions)
function Admin() {
  const nav = useNavigate();
  const token = getToken();
  useEffect(() => {
    if (!token) nav("/login");
  }, [token]);

  const [tab, setTab] = useState("destinations");
  const [data, setData] = useState([]);
  const load = async () => {
    let url = "";
    if (tab==="destinations") url="/api/admin/destinations";
    if (tab==="reviews") url="/api/reviews"; // shows recent if no filter
    if (tab==="bookings") url="/api/bookings";
    if (tab==="contacts") url="/api/admin/contacts";
    if (tab==="comments") url="/api/admin/comments";
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r=>r.json()).catch(()=>[]);
    setData(res.items || res || []);
  };
  useEffect(()=>{ load(); }, [tab]);

  const approveComment = async (id, approved) => {
    await fetch("/api/admin/comments", { method:"PATCH", headers:{ "Content-Type":"application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, approved }) });
    load();
  };
  const deleteComment = async (id) => {
    await fetch(`/api/admin/comments?id=${encodeURIComponent(id)}`, { method:"DELETE", headers:{ Authorization: `Bearer ${token}` } });
    load();
  };
  const toggleContact = async (id, processed) => {
    await fetch("/api/admin/contacts", { method:"PATCH", headers:{ "Content-Type":"application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, processed }) });
    load();
  };
  const deleteBooking = async (id) => {
    await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, { method:"DELETE", headers:{ Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Admin</h1>
      <div className="mt-3 flex items-center gap-2">
        <Button onClick={()=>setTab("destinations")}>Destinations</Button>
        <Button onClick={()=>setTab("reviews")}>Reviews</Button>
        <Button onClick={()=>setTab("bookings")}>Bookings</Button>
        <Button onClick={()=>setTab("contacts")}>Contacts</Button>
        <Button onClick={()=>setTab("comments")}>Blog Comments</Button>
      </div>

      <section className="mt-6">
        {tab==="destinations" && (
          <DestinationsAdmin token={token} />
        )}

        {tab==="reviews" && (
          <div className="grid gap-2">
            {(data.items||data).map(r=> (
              <Card key={r.id} className="p-3">
                <div className="text-xs text-black/60">{new Date(r.date).toLocaleString()}</div>
                <div className="text-sm">Slug: {r.slug} • ⭐ {r.rating}</div>
                <div className="text-sm">{r.comment}</div>
              </Card>
            ))}
          </div>
        )}

        {tab==="bookings" && (
          <div className="grid gap-2">
            {(data.items||data).map(b=> (
              <Card key={b.id} className="p-3">
                <div className="text-xs text-black/60">{new Date(b.createdAt).toLocaleString()}</div>
                <div className="text-sm">Name: {b.name} • Email: {b.email}</div>
                <div className="text-sm">Guests: {b.guests} • Status: {b.status}</div>
                <div className="text-sm">Total: ${b.totalAmount || b.price}</div>
                <Button onClick={()=>deleteBooking(b.id)}>Delete</Button>
              </Card>
            ))}
          </div>
        )}

        {tab==="contacts" && (
          <div className="grid gap-2">
            {(data.items||data).map(c=> (
              <Card key={c.id} className="p-3">
                <div className="text-xs text-black/60">{new Date(c.createdAt).toLocaleString()}</div>
                <div className="text-sm">Name: {c.name} • Email: {c.email}</div>
                <div className="text-sm">{c.message}</div>
                <Button onClick={()=>toggleContact(c.id, !c.processed)}>{c.processed? "Mark Unprocessed": "Mark Processed"}</Button>
              </Card>
            ))}
          </div>
        )}

        {tab==="comments" && (
          <div className="grid gap-2">
            {(data.items||data).map(c=> (
              <Card key={c.id} className="p-3">
                <div className="text-xs text-black/60">{new Date(c.createdAt).toLocaleString()}</div>
                <div className="text-sm">Post: {c.post?.title || "-"}</div>
                <div className="text-sm">{c.name}: {c.content}</div>
                <div className="mt-2 flex items-center gap-2">
                  <Button onClick={()=>approveComment(c.id, true)}>Approve</Button>
                  <Button onClick={()=>approveComment(c.id, false)}>Unapprove</Button>
                  <Button onClick={()=>deleteComment(c.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Deals, Account, Admin routes
function Contact() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [message,setMessage]=useState(""); const [ok,setOk]=useState(false);
  const submit=async(e)=>{ e.preventDefault(); setOk(false); await fetch(`/api/contact`,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name,email,message }) }).catch(()=>{}); setOk(true); setName(""); setEmail(""); setMessage(""); };
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Liên hệ</h1>
      <form onSubmit={submit} className="card p-4 grid gap-2 mt-4 max-w-md">
        <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên"/>
        <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email"/>
        <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Nội dung" className="input min-h-[100px]"/>
        <Button className="btn-primary">Gửi</Button>
        {ok && <p className="text-sm text-green-700">Đã gửi!</p>}
      </form>
    </main>
  );
}

function About() {
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Giới thiệu</h1>
      <p className="mt-2 text-sm text-black/70">Câu chuyện thương hiệu, tầm nhìn, sứ mệnh và đội ngũ.</p>
    </main>
  );
}

// Checkout
function Checkout() {
  const [sp] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const destination = sp.get("destination");
  const tour = sp.get("tour");
  const tourName = sp.get("tourName");
  const guests = Number(sp.get("guests") || 1);
  const from = sp.get("from") || "";
  const to = sp.get("to") || "";
  const price = 100 * guests;

  const submit = async () => {
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, tour, tourName, guests, from, to, name, email, price }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data?.error || "Booking failed");
    } catch {
      setError("Network error");
    }
  };

  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Checkout</h1>
      <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] mt-4">
        <Card className="p-4">
          {destination && <div>Destination: <span className="font-semibold">{destination}</span></div>}
          {tourName && <div>Tour: <span className="font-semibold">{tourName}</span></div>}
          <div>Guests: <span className="font-semibold">{guests}</span></div>
          {from && <div>From: <span className="font-semibold">{from}</span></div>}
          {to && <div>To: <span className="font-semibold">{to}</span></div>}
          <div className="mt-3 grid gap-2">
            <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <Button className="btn-primary" onClick={submit}>Save Booking</Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {result && <p className="text-sm text-green-700">Saved: {result.id}</p>}
          </div>
        </Card>
        <Card className="p-4 h-max">
          <div>Subtotal: ${price}</div>
          <div>Service Fee: $15</div>
          <div className="font-semibold mt-2">Total: ${price + 15}</div>
        </Card>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/destinations" element={<Destinations/>} />
        <Route path="/destinations/:slug" element={<DestinationDetail/>} />
        <Route path="/tours" element={<Tours/>} />
        <Route path="/tours/:slug" element={<TourDetail/>} />
        <Route path="/deals" element={<Deals/>} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:slug" element={<BlogDetailRoute/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="*" element={<main className="container mt-8"><Card className="p-4">Not Found</Card></main>} />
      </Routes>
    </>
  );
}