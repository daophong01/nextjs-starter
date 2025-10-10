type Key = string;

const buckets = new Map<Key, { tokens: number; last: number }>();
const CAPACITY = 10; // 10 requests
const REFILL_MS = 60_000; // per minute

export function rateLimitOrThrow(key: Key) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: CAPACITY, last: now };
  const elapsed = now - bucket.last;
  // Refill tokens proportionally
  const refill = Math.floor((elapsed / REFILL_MS) * CAPACITY);
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + refill);
  bucket.last = refill > 0 ? now : bucket.last;

  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    const err = new Error("Too Many Requests");
    // @ts-expect-error add status
    err.status = 429;
    throw err;
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
}

export function keyFromRequest(req: Request): Key {
  // Try x-forwarded-for then remote addr
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}