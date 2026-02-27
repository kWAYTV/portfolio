import { cacheLife } from "next/cache";
import { getRSS } from "@/lib/rss";

export async function GET() {
  "use cache";
  cacheLife("days");

  const xml = await getRSS();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
