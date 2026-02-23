import { getRSS } from "@/lib/rss";

export function GET() {
  const xml = getRSS();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
