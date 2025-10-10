import { z } from "zod";

export const DestinationsQuerySchema = z.object({
  q: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  countries: z.string().optional(), // comma
  tags: z.string().optional(),      // comma
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
  ratingMin: z.string().optional(),
  sort: z.enum(["", "price-asc", "price-desc", "rating-desc", "name-asc"]).optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export const ReviewCreateSchema = z.object({
  slug: z.string().min(1),
  author: z.string().optional(),
  rating: z.number().min(0).max(5),
  comment: z.string().min(1),
});

export const BookingCreateSchema = z.object({
  destination: z.string().optional(),
  guests: z.number().min(1),
  from: z.string().optional(),
  to: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  note: z.string().optional(),
  price: z.number().min(0),
});