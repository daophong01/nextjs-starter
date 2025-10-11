import { NextResponse } from "next/server";

export async function GET() {
  const body = `User-agent: *
Allow: /
Sitemap: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/sitemap.xml
`;
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}