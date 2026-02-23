import { getRSS } from "@/lib/rss";

export async function GET() {
  const xml = await getRSS();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
