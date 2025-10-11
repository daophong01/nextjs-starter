import { DestinationsQuerySchema, ReviewCreateSchema, BookingCreateSchema } from "@/lib/validation";

describe("validation schemas", () => {
  test("DestinationsQuerySchema valid basic", () => {
    const res = DestinationsQuerySchema.safeParse({ q: "ha", page: "2", pageSize: "9" });
    expect(res.success).toBe(true);
  });

  test("ReviewCreateSchema requires fields", () => {
    const res = ReviewCreateSchema.safeParse({ slug: "paris", rating: 4.5, comment: "ok", author: "me" });
    expect(res.success).toBe(true);
  });

  test("BookingCreateSchema requires fields", () => {
    const res = BookingCreateSchema.safeParse({
      destination: "paris",
      guests: 2,
      from: "2025-08-01",
      to: "2025-08-05",
      name: "A",
      email: "a@example.com",
      price: 100,
    });
    expect(res.success).toBe(true);
  });
});