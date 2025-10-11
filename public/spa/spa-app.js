// React 18 via ESM CDN is loaded from index.html
// Thuần frontend: tất cả dữ liệu lấy từ file tĩnh JSON.

import React from "https://esm.sh/react@18";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "https://esm.sh/react-router-dom@6";

// Simple hooks
const { useEffect, useState, useMemo } = React;

async function loadDestinations() {
  const res = await fetch("/spa/destinations.json");
  return res.json();
}

function DestinationCard({ d }) {
  return React.createElement(
    "div",
    { className: "card" },
    React.createElement("img", {
      src: d.image,
      alt: d.name,
      style: { width: "100%", height: 160, objectFit: "cover", borderRadius: 12, marginBottom: 8 },
    }),
    React.createElement("div", { style: { fontWeight: 600 } }, d.name),
    React.createElement("div", { style: { color: "rgba(0,0,0,.6)", fontSize: 13 } }, `${d.country} • ⭐ ${d.rating}`),
    React.createElement("div", { style: { marginTop: 6, fontSize: 13 } }, `${d.price}`),
    React.createElement(Link, { to: `#/destinations/${d.slug}`, className: "btn", style: { marginTop: 8 } }, "Chi tiết")
  );
}

function Nav() {
  return React.createElement(
    "nav",
    { className: "nav", style: { marginTop: 8 } },
    React.createElement(Link, { to: "#/" }, "Trang chủ"),
    React.createElement(Link, { to: "#/destinations" }, "Destinations"),
    React.createElement(Link, { to: "#/deals" }, "Deals"),
    React.createElement(Link, { to: "#/orders" }, "Orders")
  );
}

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestinations()
      .then((d) => setItems(d || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("h1", { style: { fontSize: 28, fontWeight: 700 } }, "TravelGo SPA"),
    React.createElement("p", { style: { color: "rgba(0,0,0,.7)" } }, "React thuần dùng dữ liệu tĩnh (JSON)."),
    loading
      ? React.createElement("div", null, "Đang tải...")
      : React.createElement(
          "div",
          { style: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", marginTop: 12 } },
          items.slice(0, 6).map((d) => React.createElement(DestinationCard, { key: d.slug, d }))
        )
  );
}

function DestinationsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    loadDestinations().then(setItems).catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        d.country.toLowerCase().includes(s) ||
        (d.tags || []).some((t) => t.toLowerCase().includes(s))
    );
  }, [q, items]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("h2", { style: { fontSize: 22, fontWeight: 700 } }, "Tất cả điểm đến"),
    React.createElement("input", {
      placeholder: "Tìm kiếm...",
      value: q,
      onChange: (e) => setQ(e.target.value),
      style: { marginTop: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)" },
    }),
    React.createElement(
      "div",
      { style: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", marginTop: 12 } },
      filtered.map((d) => React.createElement(DestinationCard, { key: d.slug, d }))
    )
  );
}

function DestinationDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    loadDestinations().then((all) => setItem(all.find((x) => x.slug === slug)));
  }, [slug]);

  const addOrder = () => {
    if (!item) return;
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const order = {
      id: `SPA-${Date.now()}`,
      slug: item.slug,
      name: item.name,
      guests,
      price: item.price * guests + 15,
      status: "pending",
      date: new Date().toISOString(),
    };
    localStorage.setItem("orders", JSON.stringify([order, ...orders]));
    alert("Đã thêm vào Orders (localStorage).");
    nav("/orders");
  };

  if (!item) return React.createElement("div", null, "Đang tải...");

  return React.createElement(
    "div",
    { className: "card" },
    React.createElement("h2", { style: { fontSize: 22, fontWeight: 700 } }, item.name),
    React.createElement("img", {
      src: item.image,
      alt: item.name,
      style: { width: "100%", height: 240, objectFit: "cover", borderRadius: 12, margin: "8px 0" },
    }),
    React.createElement("p", null, item.description),
    React.createElement("p", { style: { color: "rgba(0,0,0,.6)" } }, `${item.country} • ⭐ ${item.rating}`),
    React.createElement("div", { style: { marginTop: 8 } }, `Giá: ${item.price} / khách`),
    React.createElement(
      "div",
      { style: { marginTop: 8, display: "flex", gap: 8, alignItems: "center" } },
      React.createElement("label", null, "Khách:"),
      React.createElement("input", {
        type: "number",
        min: 1,
        value: guests,
        onChange: (e) => setGuests(Math.max(1, Number(e.target.value || 1))),
        style: { width: 80, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)" },
      }),
      React.createElement("button", { className: "btn btn-primary", onClick: addOrder }, "Thêm vào Orders")
    )
  );
}

function DealsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    loadDestinations().then(setItems).catch(() => setItems([]));
  }, []);
  const discounted = items.map((d) => ({ ...d, price: Math.round(d.price * 0.9) }));
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("h2", { style: { fontSize: 22, fontWeight: 700 } }, "Ưu đãi (-10%)"),
    React.createElement(
      "div",
      { style: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", marginTop: 12 } },
      discounted.map((d) => React.createElement(DestinationCard, { key: d.slug, d }))
    )
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
  }, []);
  const clear = () => {
    localStorage.removeItem("orders");
    setOrders([]);
  };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("h2", { style: { fontSize: 22, fontWeight: 700 } }, "Orders (localStorage)"),
    React.createElement(
      "div",
      { className: "card", style: { marginTop: 8 } },
      React.createElement("button", { className: "btn", onClick: clear }, "Xóa tất cả")
    ),
    React.createElement(
      "div",
      { style: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", marginTop: 12 } },
      orders.map((o) =>
        React.createElement(
          "div",
          { className: "card", key: o.id },
          React.createElement("div", { style: { fontFamily: "monospace", fontSize: 12 } }, o.id),
          React.createElement("div", null, o.name),
          React.createElement("div", { style: { color: "rgba(0,0,0,.6)", fontSize: 13 } }, `${o.guests} khách • ${new Date(o.date).toLocaleString()}`),
          React.createElement("div", { style: { marginTop: 6, fontSize: 13 } }, `Tổng: ${o.price}`),
          React.createElement("span", { className: "btn", style: { marginTop: 8 } }, o.status)
        )
      )
    )
  );
}

export function App() {
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(Nav),
    React.createElement(
      HashRouter,
      null,
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: "/", element: React.createElement(Home) }),
        React.createElement(Route, { path: "/destinations", element: React.createElement(DestinationsPage) }),
        React.createElement(Route, { path: "/destinations/:slug", element: React.createElement(DestinationDetail) }),
        React.createElement(Route, { path: "/deals", element: React.createElement(DealsPage) }),
        React.createElement(Route, { path: "/orders", element: React.createElement(OrdersPage) })
      )
    )
  );
}