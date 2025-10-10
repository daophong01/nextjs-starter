import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data", "json");

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureDir();
  const file = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, filename);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}