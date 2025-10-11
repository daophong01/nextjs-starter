// React 18 via ESM CDN is loaded from index.html
// This SPA is light-weight and runs alongside Next.js backend/API.

import React from "https://esm.sh/react@18";

// Simple state and effect hooks via React
const { useEffect, useState } = React;

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
    React.createElement("div", { style: { marginTop: 6, fontSize: 13 } }, `$${d.price}`),
  );
}

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/destinations?pageSize=6");
        const d = await res.json();
        setItems(d.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("h1", { style: { fontSize: 28, fontWeight: 700, marginTop: 16 } }, "TravelGo SPA"),
    React.createElement(
      "p",
      { style: { color: "rgba(0,0,0,.7)" } },
      "Phiên bản React thuần chạy cùng backend Next.js. Dữ liệu lấy từ /api/destinations."
    ),
    loading
      ? React.createElement("div", null, "Đang tải...")
      : React.createElement(
          "div",
          { style: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", marginTop: 12 } },
          items.map((d) => React.createElement(DestinationCard, { key: d.slug, d }))
        )
  );
}

export function App() {
  return React.createElement(Home);
}