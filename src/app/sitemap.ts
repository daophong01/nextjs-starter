import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";

  let destinations: Array<{ slug: string }> = [];
  try {
    destinations = await prisma.destination.findMany({ select: { slug: true } });
  } catch {
    destinations = [];
  }

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/destinations`, lastModified: new Date() },
    { url: `${base}/deals`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];

  destinations.forEach((d) =>
    routes.push({ url: `${base}/destinations/${d.slug}`, lastModified: new Date() })
  );

  return routes;
}