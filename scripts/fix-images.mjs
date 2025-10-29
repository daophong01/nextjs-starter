// Fix destination image URLs in DB to prevent upstream 404s.
// Usage: node scripts/fix-images.mjs

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const replacements = [
  {
    slug: "ha-noi",
    image:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "da-nang",
    image:
      "https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1600&auto=format&fit=crop",
  },
];

async function run() {
  console.log("Fixing destination images...");
  for (const { slug, image } of replacements) {
    const dest = await prisma.destination.findUnique({ where: { slug } });
    if (!dest) {
      console.log(`- Skip ${slug}: not found`);
      continue;
    }
    if (dest.image === image) {
      console.log(`- Skip ${slug}: already correct`);
      continue;
    }
    await prisma.destination.update({
      where: { slug },
      data: { image },
    });
    console.log(`- Updated ${slug}`);
  }
  console.log("Done.");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });