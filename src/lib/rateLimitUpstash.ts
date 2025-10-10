import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;

export function getLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!limiter) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: false,
      prefix: "rl",
    });
  }
  return limiter;
}

export async function assertNotRateLimited(key: string) {
  const l = getLimiter();
  if (!l) return; // not configured
  const res = await l.limit(key);
  if (!res.success) {
    const err = new Error("Too Many Requests");
    // @ts-expect-error status for NextResponse
    err.status = 429;
    throw err;
  }
}

export function keyFromRequest(req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}