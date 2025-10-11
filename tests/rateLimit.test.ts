import { rateLimitOrThrow } from "@/lib/rateLimit";

describe("rateLimitOrThrow", () => {
  test("allows limited requests then throws", () => {
    const key = "ip:test";
    let thrown = 0;
    for (let i = 0; i < 12; i++) {
      try {
        rateLimitOrThrow(key);
      } catch (e) {
        thrown++;
      }
    }
    expect(thrown).toBeGreaterThan(0);
  });
});