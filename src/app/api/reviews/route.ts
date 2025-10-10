import { NextResponse } from "next/server";
import { readJson, writeJson } from "../../../lib/store";
import { REVIEWS, type Review } from "../../../data/reviews";

const FILENAME = "reviews.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = (searchParams.get("slug") || "").trim();
  const all = await readJson<Review[]>(FILENAME, REVIEWS);

  const list = slug ? all.filter((r) => r.slug === slug) : all;
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { slug, author, rating, comment } = body as Partial<Review>;
  if (!slug || typeof rating !== "number" || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const id = `api-${Date.now()}`;
  const date = new Date().toISOString().slice(0, 10);
  const review: Review = {
    id,
    slug,
    author: author || "Khách ẩn danh",
    rating,
    comment,
    date,
  };

  const all = await readJson<Review[]>(FILENAME, REVIEWS);
  const next = [review, ...all];
  await writeJson(FILENAME, next);

  return NextResponse.json(review, { status: 201 });
}