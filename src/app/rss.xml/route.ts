import { cacheLife } from "next/cache";
import { getRSS } from "@/lib/rss";

export function GET() {
  "use cache";
  cacheLife("max");

  return new Response(getRSS(), {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
