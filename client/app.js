import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";
import { Routes, Route, Link, useNavigate, useSearchParams } from "https://esm.sh/react-router-dom@6.22.3";

const API = (import.meta.env && import.meta.env.VITE_API_URL) || "";

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
    fetch(`${API}/api/destinations`).then(r => r.json()).then(data => setItems(data.items || [])).catch(() => setItems([]));
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
          <div key={d.slug} className="card overflow-hidden">
            <img src={d.image} alt={d.name} className="h-40 w-full object-cover"/>
            <div className="p-3">
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-black/70">{d.country}</div>
              <Link to={`/checkout?destination=${encodeURIComponent(d.slug)}&guests=2`} className="text-sm underline mt-2 inline-block">Book →</Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="card p-4">No destinations.</div>}
      </div>
    </main>
  );
}

function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/blog/posts`).then(r => r.json()).then(setPosts).catch(() => setPosts([]));
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

function BlogDetail({ slug }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/blog/posts`).then(r => r.json()).then(list => {
      const p = list.find(x => x.slug === slug);
      setPost(p || null);
    });
    fetch(`${API}/api/blog/comments?slug=${encodeURIComponent(slug)}`).then(r => r.json()).then(data => setComments(data.items || [])).catch(() => setComments([]));
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

function BlogDetailRoute() {
  const [sp] = useSearchParams();
  // fallback if direct route param isn't parsed (simple approach)
  const slug = location.pathname.split("/").pop();
  return <BlogDetail slug={slug || sp.get("slug")} />;
}

function Checkout() {
  const [sp] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const destination = sp.get("destination");
  const guests = Number(sp.get("guests") || 1);
  const from = sp.get("from") || "";
  const to = sp.get("to") || "";
  const price = 100 * guests;

  const submit = async () => {
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, guests, from, to, name, email, price }),
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
          <div>Destination: <span className="font-semibold">{destination || "N/A"}</span></div>
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
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:slug" element={<BlogDetailRoute/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="*" element={<main className="container mt-8"><div className="card p-4">Not Found</div></main>} />
      </Routes>
    </>
  );
}