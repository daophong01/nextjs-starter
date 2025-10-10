import { mkdir, readFile, writeFile } from "node:fs/promises";import { existsSync } from "node:fs";
import { join } from "node:path";
export type Booking = {  id: string;
  createdAt: string;  fullName: string;
  email: string;  travelers: number;
  startDate: string;  destination?: string; // destination slug
  tour?: string; // tour id  note?: string;
};
const DATA_DIR = join(process.cwd(), ".data");const BOOKINGS_FILE = join(DATA_DIR, "bookings.json");
async function ensureStore() {
  if (!existsSync(DATA_DIR)) {    await mkdir(DATA_DIR, { recursive: true });
  }  if (!existsSync(BOOKINGS_FILE)) {
    await writeFile(BOOKINGS_FILE, "[]", "utf8");  }
}
export async function readBookings(): Promis<Booking[]> {
  await ensureStore();  const raw = await readFile(BOOKINGS_FILE, "utf8");
  try {    const data = JSON.parse(raw) as Booking[];
    return Array.isArray(data) ? data : [];  } catch {
    return [];  }
}
export async function writeBookings(all: Booking[]) {  await ensureStore();
  await