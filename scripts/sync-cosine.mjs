/**
 * Sync HTML from https://cosine.sh into public/cosine.html
 * - Uses global fetch (Node 18+)
 * - Saves a timestamp header for traceability
 */
import { writeFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const url = 'https://cosine.sh';
const outPath = 'public/cosine.html';

async function main() {
  const res = await fetch(url, {
    headers: {
      // Minimal headers to get standard page; avoid bot blocks
      'User-Agent': 'Mozilla/5.0 (compatible; CosineSync/1.0; +https://cosine.sh)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const stamped = `<!-- Synced from ${url} at ${new Date().toISOString()} -->\n` + html;

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, stamped, 'utf8');

  console.log(`Saved ${url} => ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});