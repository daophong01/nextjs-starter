import { NextResponse } from "next/server";
import { DESTINATIONS } from "../../../data/destinations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const priceMin = Number(searchParams.get("priceMin") || 0);
  const priceMax = Number(searchParams.get("priceMax") || Infinity);
  const ratingMin = Number(searchParams.get("ratingMin") || 0);
  const countries = (searchParams.get("countries") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tags = (searchParams.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const sort = searchParams.get("sort") || "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.max(1, Number(searchParams.get("pageSize") || 9));

  const filtered = DESTINATIONS.filter((d) => {
    const matchQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q));
    const matchCountries =
      countries.length === 0 || countries.includes(d.country);
    const matchTags =
      tags.length === 0 || tags.every((t) => d.tags.includes(t));
    const matchPrice = d.price >= priceMin && d.price <= priceMax;
    const matchRating = d.rating >= ratingMin;
    return matchQ && matchCountries && matchTags && matchPrice && matchRating;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const total = sorted.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = sorted.slice(start, end);

  return NextResponse.json({ total, page, pageSize, items });
}