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

// Admin Destinations CRUD (Prisma)
app.get("/api/admin/destinations", async (req, res) => {
  try {
    const items = await prisma.destination.findMany({ orderBy: { name: "asc" }, take: 500 });
    return res.json({ items });
  } catch {
    return res.json({ items: [] });
  }
});
app.post("/api/admin/destinations", async (req, res) => {
  const { slug, name, description, image, rating, price, country, tags } = req.body || {};
  if (!slug || !name) return res.status(400).json({ error: "Missing fields" });
  try {
    const created = await prisma.destination.create({
      data: { slug, name, description: description || "", image: image || "", rating: Number(rating || 0), price: Number(price || 0), country: country || "", tags: (Array.isArray(tags) ? tags.join(",") : (tags || "")) },
    });
    return res.json({ ok: true, item: created });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});
app.patch("/api/admin/destinations", async (req, res) => {
  const { id, ...data } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    if (data.tags && Array.isArray(data.tags)) data.tags = data.tags.join(",");
    const updated = await prisma.destination.update({ where: { id }, data });
    return res.json({ ok: true, item: updated });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});
app.delete("/api/admin/destinations", async (req, res) => {
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    await prisma.destination.delete({ where: { id } });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});

// Reviews
app.get("/api/reviews", async (req, res) => {
  const slug = String(req.query.slug || "");
  const email = String(req.query.email || "");
  try {
    if (slug) {
      const items = await prisma.review.findMany({ where: { slug }, orderBy: { date: "desc" }, take: 50 });
      return res.json({ items });
    }
    if (email) {
      const items = await prisma.review.findMany({ where: { author: email }, orderBy: { date: "desc" }, take: 50 });
      return res.json({ items });
    }
    return res.json({ items: [] });
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
app.delete("/api/admin/reviews", async (req, res) => {
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    await prisma.review.delete({ where: { id } });
    return res.json({ ok: true });
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

// Admin moderation for blog comments
app.get("/api/admin/comments", async (req, res) => {
  try {
    const items = await prisma.comment.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { post: true } });
    return res.json({ items });
  } catch {
    return res.json({ items: [] });
  }
});
app.patch("/api/admin/comments", async (req, res) => {
  const { id, approved } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    const updated = await prisma.comment.update({ where: { id }, data: { approved: !!approved } });
    return res.json({ ok: true, item: updated });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});
app.delete("/api/admin/comments", async (req, res) => {
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    await prisma.comment.delete({ where: { id } });
    return res.json({ ok: true });
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
app.get("/api/bookings", async (req, res) => {
  const email = String(req.query.email || "");
  try {
    const where = email ? { email } : {};
    const list = await prisma.booking.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
    return res.json(list);
  } catch {
    return res.json([]);
  }
});
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
app.patch("/api/admin/bookings", async (req, res) => {
  const { id, status } = req.body || {};
  if (!id || !status) return res.status(400).json({ error: "Missing fields" });
  try {
    const updated = await prisma.booking.update({ where: { id }, data: { status } });
    return res.json({ ok: true, item: updated });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});
app.delete("/api/admin/bookings", async (req, res) => {
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    await prisma.booking.delete({ where: { id } });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});

// Contact
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: "Missing fields" });
  try {
    const saved = await prisma.contactMessage.create({ data: { name, email, message } });
    return res.json({ ok: true, id: saved.id });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});
app.get("/api/admin/contacts", async (req, res) => {
  try {
    const items = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return res.json({ items });
  } catch {
    return res.json({ items: [] });
  }
});
app.patch("/api/admin/contacts", async (req, res) => {
  const { id, processed } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    const updated = await prisma.contactMessage.update({ where: { id }, data: { processed: !!processed } });
    return res.json({ ok: true, item: updated });
  } catch {
    return res.status(500).json({ error: "Failed" });
  }
});
app.delete("/api/admin/contacts", async (req, res) => {
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "Missing id" });
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed" });
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