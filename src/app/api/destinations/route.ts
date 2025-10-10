import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DestinationsQuerySchema } from "@/lib/validation";
import { DESTINATIONS } from "../../../data/destinations";

/**
 * Seed destinations into DB on first read if table empty.
 */
async function ensureSeeded() {
  const count = await prisma.destination.count();
  if (count === 0) {
    for (const d of DESTINATIONS) {
      await prisma.destination.create({
        data: {
          slug: d.slug,
          name: d.name,
          description: d.description,
          image: d.image,
          rating: d.rating,
          price: Math.round(d.price),
          country: d.country,
          tags: d.tags.join(","),
        },
      });
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = DestinationsQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const q = (parsed.data.q || "").toLowerCase().trim();
  const priceMin = Number(parsed.data.priceMin || 0);
  const priceMax = Number(parsed.data.priceMax || Infinity);
  const ratingMin = Number(parsed.data.ratingMin || 0);
  const countries = (parsed.data.countries || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tags = (parsed.data.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const sort = parsed.data.sort || "";
  const page = Math.max(1, Number(parsed.data.page || 1));
  const pageSize = Math.max(1, Number(parsed.data.pageSize || 9));

  await ensureSeeded();

  // Fetch all then filter in memory for simplicity; could translate to SQL with Prisma where/orderBy.
  const all = await prisma.destination.findMany();
  const filtered = all.filter((d) => {
    const dTags = d.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const matchQ =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      dTags.some((t) => t.toLowerCase().includes(q));
    const matchCountries = countries.length === 0 || countries.includes(d.country);
    const matchTags = tags.length === 0 || tags.every((t) => dTags.includes(t));
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
  const items = sorted.slice(start, end).map((d) => ({
    slug: d.slug,
    name: d.name,
    description: d.description,
    image: d.image,
    rating: d.rating,
    price: d.price,
    country: d.country,
    tags: d.tags.split(",").filter(Boolean),
  }));

  return NextResponse.json({ total, page, pageSize, items });
}