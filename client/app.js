import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";
import { Routes, Route, Link, useParams, useSearchParams } from "https://esm.sh/react-router-dom@6.22.3";

const API = "";

// Simple NavBar
function NavBar() {
  return (
    <nav className="border-b border-black/10">
      <div className="container py-3 flex items-center justify-between">
        <Link to="/" className="font-bold">TravelGo</Link>
        <div className="flex items-center gap-3">
          <Link className="btn" to="/destinations">Destinations</Link>
          <Link className="btn" to="/tours">Tours</Link>
          <Link className="btn" to="/blog">Blog</Link>
          <Link className="btn" to="/contact">Contact</Link>
          <Link className="btn" to="/about">About</Link>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Khám phá thế giới theo cách của bạn</h1>
        <p className="text-sm mt-2 text-black/70">Tìm điểm đến yêu thích, xem gợi ý và đặt chỗ nhanh chóng.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/destinations" className="btn btn-primary">Destinations</Link>
          <Link to="/tours" className="btn">Tours</Link>
          <Link to="/blog" className="btn">Blog</Link>
        </div>
      </section>
    </main>
  );
}

function Destinations() {
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
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="mt-3 rounded border px-3 py-2"/>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(d => (
          <Link key={d.slug} to={`/destinations/${d.slug}`} className="card overflow-hidden">
            <img src={d.image} alt={d.name} className="h-40 w-full object-cover"/>
            <div className="p-3">
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-black/70">{d.country}</div>
              <span className="text-sm underline mt-2 inline-block">Xem chi tiết →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="card p-4">No destinations.</div>}
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
  if (!d) return <main className="container mt-8"><div className="card p-4">Not found</div></main>;
  return (
    <main className="container">
      <div className="mt-8 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <div className="card overflow-hidden">
          <img src={d.image} alt={d.name} className="h-64 w-full object-cover"/>
          <div className="p-4">
            <h1 className="text-2xl font-bold">{d.name}</h1>
            <p className="text-sm text-black/70 mt-1">{d.description}</p>
            <div className="mt-3 text-sm flex items-center gap-3">
              <span>⭐ {d.rating}</span>
              <span>From ${d.price}</span>
              <span>{d.country}</span>
            </div>
          </div>
        </div>
        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Đặt chỗ nhanh</h2>
          <Link to={`/checkout?destination=${encodeURIComponent(slug)}&guests=2`} className="btn btn-primary">Book now</Link>
        </aside>
      </div>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Bản đồ</h2>
          <iframe title="Map" src={`https://www.google.com/maps?q=${encodeURIComponent(d.name + ", " + d.country)}&output=embed`} className="w-full h-64 rounded border"/>
        </div>
        <div className="card p-4">
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
        </div>
      </section>
    </main>
  );
}

function Tours() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  useEffect(()=>{ fetch(`/api/tours`).then(r=>r.json()).then(data=>setItems(data.items||[])).catch(()=>setItems([])); },[]);
  const filtered = items.filter(t => !q || (t.name || "").toLowerCase().includes(q.toLowerCase()));
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Tours</h1>
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search tours..." className="mt-3 rounded border px-3 py-2"/>
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
        {filtered.length === 0 && <div className="card p-4">No tours.</div>}
      </div>
    </main>
  );
}

function TourDetail() {
  const { slug } = useParams();
  const [t, setT] = useState(null);
  useEffect(()=>{ fetch(`/api/tours/${slug}`).then(r=>r.json()).then(setT).catch(()=>setT(null)); },[slug]);
  if (!t) return <main className="container mt-8"><div className="card p-4">Not found</div></main>;
  return (
    <main className="container">
      <section className="mt-8 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <div className="card overflow-hidden">
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
        </div>
        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Đặt tour</h2>
          <Link to={`/checkout?tour=${encodeURIComponent(slug)}&tourName=${encodeURIComponent(t.name)}&guests=2`} className="btn btn-primary">Đặt ngay</Link>
        </aside>
      </section>
    </main>
  );
}

function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`/api/blog/posts`).then(r => r.json()).then(setPosts).catch(() => setPosts([]));
  }, []);
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Blog</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {posts.map(p => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="card overflow-hidden">
            <img src={p.image} alt={p.title} className="h-40 w-full object-cover"/>
            <div className="p-3">
              <div className="font-semibold">{p.title}</div>
              <p className="text-sm text-black/70 mt-1">{p.excerpt}</p>
              <span className="text-sm underline mt-2 inline-block">Read →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

function BlogDetailRoute() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetch(`/api/blog/posts`).then(r => r.json()).then(list => setPost(list.find(x => x.slug === slug) || null));
    fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`).then(r => r.json()).then(data => setComments(data.items || [])).catch(() => setComments([]));
  }, [slug]);
  if (!post) return <main className="container mt-8"><div className="card p-4">Post not found.</div></main>;
  return (
    <main className="container">
      <div className="mt-8">
        <img src={post.image} alt={post.title} className="h-56 w-full object-cover rounded"/>
        <h1 className="text-2xl font-bold mt-4">{post.title}</h1>
        <p className="mt-3">{post.content}</p>

        <div className="mt-6 card p-4">
          <div className="font-semibold mb-2">Comments</div>
          {comments.length === 0 ? <p className="text-sm text-black/70">No comments.</p> : (
            <div className="grid gap-2">
              {comments.map(c => (
                <div key={c.id} className="rounded border border-black/10 p-2">
                  <div className="text-xs text-black/60">{new Date(c.createdAt).toLocaleString()}</div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm">{c.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Contact() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [message,setMessage]=useState(""); const [ok,setOk]=useState(false);
  const submit=async(e)=>{ e.preventDefault(); setOk(false); await fetch(`/api/contact`,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name,email,message }) }).catch(()=>{}); setOk(true); setName(""); setEmail(""); setMessage(""); };
  return (
    <main className="container">
      <h1 className="text-2xl font-bold mt-8">Liên hệ</h1>
      <form onSubmit={submit} className="card p-4 grid gap-2 mt-4 max-w-md">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên" className="rounded border px-3 py-2"/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="rounded border px-3 py-2"/>
        <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Nội dung" className="rounded border px-3 py-2 min-h-[100px]"/>
        <button className="btn btn-primary">Gửi</button>
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
        <section className="card p-4">
          {destination && <div>Destination: <span className="font-semibold">{destination}</span></div>}
          {tourName && <div>Tour: <span className="font-semibold">{tourName}</span></div>}
          <div>Guests: <span className="font-semibold">{guests}</span></div>
          {from && <div>From: <span className="font-semibold">{from}</span></div>}
          {to && <div>To: <span className="font-semibold">{to}</span></div>}
          <div className="mt-3 grid gap-2">
            <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="rounded border px-3 py-2"/>
            <input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="rounded border px-3 py-2"/>
            <button className="btn btn-primary" onClick={submit}>Save Booking</button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {result && <p className="text-sm text-green-700">Saved: {result.id}</p>}
          </div>
        </section>
        <aside className="card p-4 h-max">
          <div>Subtotal: ${price}</div>
          <div>Service Fee: $15</div>
          <div className="font-semibold mt-2">Total: ${price + 15}</div>
        </aside>
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
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:slug" element={<BlogDetailRoute/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="*" element={<main className="container mt-8"><div className="card p-4">Not Found</div></main>} />
      </Routes>
    </>
  );
}