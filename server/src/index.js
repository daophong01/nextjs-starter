import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { DESTINATIONS, TOURS, POSTS } from "./data.js";

const prisma = new PrismaClient();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Health
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// Destinations with static fallback
app.get("/api/destinations", async (req, res) => {
  try {
    // If you have Destination table, replace with prisma query
    return res.json({ items: DESTINATIONS, total: DESTINATIONS.length });
  } catch {
    return res.json({ items: [], total: 0 });
  }
});
app.get("/api/destinations/:slug", async (req, res) => {
  const slug = String(req.params.slug || "");
  const d = DESTINATIONS.find(x => x.slug === slug);
  if (!d) return res.status(404).json({ error: "Not found" });
  return res.json(d);
});

// Reviews for destinations (simple model via Prisma Comment tied to post, or create a dedicated table if needed)
// Here we use Comment with a special post slug mapping; for production use a Review table.
app.get("/api/reviews", async (req, res) => {
  const slug = String(req.query.slug || "");
  if (!slug) return res.status(400).json({ error: "Missing slug" });
  try {
    const items = await prisma.review.findMany({
      where: { slug },
      orderBy: { date: "desc" },
      take: 50,
    });
    return res.json({ items });
  } catch {
    return res.json({ items: [] });
  }
});
app.post("/api/reviews", async (req, res) => {
  const { slug, author, rating, comment } = req.body || {};
  if (!slug || !author || !rating) return res.status(400).json({ error: "Missing fields" });
  try {
    const created = await prisma.review.create({
      data: { slug, author, rating: Number(rating), comment: String(comment || ""), date: new Date().toISOString() },
    });
    return res.json({ ok: true, id: created.id });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});

// Tours
app.get("/api/tours", async (req, res) => {
  res.json({ items: TOURS, total: TOURS.length });
});
app.get("/api/tours/:slug", async (req, res) => {
  const slug = String(req.params.slug || "");
  const t = TOURS.find(x => x.slug === slug);
  if (!t) return res.status(404).json({ error: "Not found" });
  return res.json(t);
});

// Blog posts
app.get("/api/blog/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: "desc" },
      take: 100,
    });
    if (posts.length) return res.json(posts);
  } catch {}
  return res.json(POSTS);
});

// Blog comments
app.get("/api/blog/comments", async (req, res) => {
  const slug = String(req.query.slug || "");
  if (!slug) return res.status(400).json({ error: "Missing slug" });
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return res.json({ items: [] });
    const items = await prisma.comment.findMany({
      where: { postId: post.id, approved: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return res.json({ items });
  } catch {
    return res.json({ items: [] });
  }
});

app.post("/api/blog/comments", async (req, res) => {
  const { slug, name, email, content } = req.body || {};
  if (!slug || !name || !content) return res.status(400).json({ error: "Missing fields" });
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    const created = await prisma.comment.create({
      data: { postId: post.id, name, email, content, approved: false },
    });
    return res.json({ ok: true, id: created.id });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});

// Coupons validation
app.post("/api/coupons", async (req, res) => {
  const { code, amount } = req.body || {};
  const ccode = String(code || "").trim().toUpperCase();
  const amt = Number(amount || 0);
  if (!ccode || !Number.isFinite(amt) || amt <= 0) return res.status(400).json({ error: "Invalid code/amount" });
  try {
    const c = await prisma.coupon.findUnique({ where: { code: ccode } });
    const now = new Date();
    if (!c || !c.isActive || (c.validFrom && c.validFrom > now) || (c.validTo && c.validTo < now)) {
      return res.json({ valid: false, discount: 0 });
    }
    if (c.usageLimit && c.usedCount >= c.usageLimit) return res.json({ valid: false, discount: 0 });
    if (amt < c.minOrderAmount) return res.json({ valid: false, discount: 0 });

    let discount = 0;
    if ((c.discountType || "percentage") === "percentage") discount = Math.floor((amt * c.discountValue) / 100);
    else discount = c.discountValue;
    if (c.maxDiscountAmount) discount = Math.min(discount, c.maxDiscountAmount);
    discount = Math.max(0, Math.min(discount, amt));
    res.json({ valid: true, discount, description: c.description || "" });
  } catch {
    res.json({ valid: false, discount: 0 });
  }
});

// Bookings
app.post("/api/bookings", async (req, res) => {
  const data = req.body || {};
  try {
    const serviceFee = 15;
    const tax = 0;
    const base = Number(data.price || 0);
    let discountAmount = 0;
    let couponCode = String(data.couponCode || "").trim().toUpperCase() || undefined;

    if (couponCode) {
      const c = await prisma.coupon.findUnique({ where: { code: couponCode } }).catch(() => null);
      if (c && c.isActive && base >= (c.minOrderAmount || 0)) {
        discountAmount =
          (c.discountType || "percentage") === "percentage" ? Math.floor((base * c.discountValue) / 100) : c.discountValue;
        if (c.maxDiscountAmount) discountAmount = Math.min(discountAmount, c.maxDiscountAmount);
        discountAmount = Math.max(0, Math.min(discountAmount, base));
        await prisma.coupon.update({ where: { code: couponCode }, data: { usedCount: (c.usedCount || 0) + 1 } });
      }
    }

    const totalAmount = Math.max(0, base + serviceFee + tax - discountAmount);

    const booking = await prisma.booking.create({
      data: {
        destination: data.destination || null,
        tourSlug: data.tour || null,
        tourName: data.tourName || null,
        guests: Number(data.guests || 1),
        from: data.from || null,
        to: data.to || null,
        name: String(data.name || ""),
        email: String(data.email || ""),
        note: data.note || null,
        price: base,
        status: "pending",
        couponCode,
        discountAmount,
        totalAmount,
        serviceFee,
        tax,
      },
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ error: "Booking failed" });
  }
});

// Uploads (multer)
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

import { promises as fsp } from "fs";
app.get("/api/uploads", async (req, res) => {
  const folder = String(req.query.folder || "").trim();
  if (!folder) return res.status(400).json({ error: "Missing folder" });
  const baseDir = path.join(process.cwd(), "public", "uploads", folder);
  try {
    const items = await fsp.readdir(baseDir, { withFileTypes: true });
    const files = items.filter(d => d.isFile()).map(d => ({ name: d.name, url: `/uploads/${folder}/${d.name}` }));
    res.json({ files });
  } catch {
    res.json({ files: [] });
  }
});

app.post("/api/uploads", upload.single("file"), async (req, res) => {
  const folder = String(req.body.folder || "").trim();
  const allowed = new Set(["blog", "tours", "destinations", "avatars"]);
  if (!folder || !allowed.has(folder)) return res.status(400).json({ error: "Invalid folder" });
  if (!req.file) return res.status(400).json({ error: "Missing file" });

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fsp.mkdir(uploadsDir, { recursive: true });
  const safeName = (req.file.originalname || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const outPath = path.join(uploadsDir, filename);
  await fsp.writeFile(outPath, req.file.buffer);
  return res.json({ ok: true, url: `/uploads/${folder}/${filename}`, name: filename });
});

// Serve client (static SPA)
app.use(express.static(path.join(process.cwd(), "client")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client", "index.html"));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});