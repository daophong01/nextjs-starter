import { PrismaClient } from "@prisma/client";
import { DESTINATIONS } from "../src/data/destinations.js";

const prisma = new PrismaClient();

async function main() {
  for (const d of DESTINATIONS) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        description: d.description,
        image: d.image,
        rating: d.rating,
        price: Math.round(d.price),
        country: d.country,
        tags: d.tags.join(","),
      },
      create: {
        slug: d.slug,
        name: d.name,
        description: d.description,
        image: d.image,
        rating: d.rating,
        price: Math.round(d.price),
        country: d.country,
        tags: d.tags.join(","),
      },
    });
  }
  console.log("Seeded destinations:", DESTINATIONS.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});