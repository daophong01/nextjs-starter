import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DestinationsQuerySchema } from "@/lib/validation";
import { DESTINATIONS } from "@/data/destinations";

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

  // Build Prisma where/orderBy with pagination
  const where: any = {
    AND: [
      ratingMin ? { rating: { gte: ratingMin } } : {},
      { price: { gte: priceMin } },
      Number.isFinite(priceMax) ? { price: { lte: priceMax } } : {},
    ].filter(Boolean),
  };

  // q search across name, country, tags (contains)
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
      { tags: { contains: q, mode: "insensitive" } },
    ];
  }

  // countries filter (OR of country equals)
  if (countries.length > 0) {
    where.AND.push({
      OR: countries.map((c) => ({ country: { equals: c } })),
    });
  }

  // tags filter (AND each requested tag must be contained in the tags string)
  if (tags.length > 0) {
    where.AND.push(
      ...tags.map((t) => ({ tags: { contains: t } }))
    );
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "rating-desc"
      ? { rating: "desc" }
      : sort === "name-asc"
      ? { name: "asc" }
      : undefined;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const [total, rows] = await Promise.all([
      prisma.destination.count({ where }),
      prisma.destination.findMany({ where, orderBy, skip, take }),
    ]);

    const items = rows.map((d) => ({
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
  } catch {
    // Fallback to static data if DB is not ready
    const filtered = DESTINATIONS.filter((d) => {
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      const matchCountries = countries.length === 0 || countries.includes(d.country);
      const matchTags = tags.length === 0 || tags.every((t) => d.tags.includes(t));
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

    return NextResponse.json({
      total,
      page,
      pageSize,
      items: items.map((d) => ({
        slug: d.slug,
        name: d.name,
        description: d.description,
        image: d.image,
        rating: d.rating,
        price: Math.round(d.price),
        country: d.country,
        tags: d.tags,
      })),
    });
  }
}