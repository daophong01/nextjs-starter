import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * GET /api/uploads?folder=blog|tours|destinations|avatars
 * Lists files in public/uploads/{folder}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = (searchParams.get("folder") || "").trim();
  if (!folder) return NextResponse.json({ error: "Missing folder" }, { status: 400 });
  const baseDir = path.join(process.cwd(), "public", "uploads", folder);

  try {
    const items = await fs.readdir(baseDir, { withFileTypes: true }).catch(() => []);
    const files = items
      .filter((d) => d.isFile())
      .map((d) => ({
        name: d.name,
        url: `/uploads/${folder}/${d.name}`,
      }));
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ files: [] });
  }
}

/**
 * POST multipart/form-data
 * Fields:
 *  - folder: blog|tours|destinations|avatars
 *  - file: Blob (image)
 * Saves to public/uploads/{folder}/{timestamp}-{filename}
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const folder = String(form.get("folder") || "").trim();
    const file = form.get("file") as File | null;

    if (!folder || !file) {
      return NextResponse.json({ error: "Missing folder or file" }, { status: 400 });
    }

    const allowed = new Set(["blog", "tours", "destinations", "avatars"]);
    if (!allowed.has(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const outPath = path.join(uploadsDir, filename);

    await fs.writeFile(outPath, buffer);

    const url = `/uploads/${folder}/${filename}`;
    return NextResponse.json({ ok: true, url, name: filename });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}