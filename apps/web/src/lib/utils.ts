import { env } from "@/env";

// biome-ignore lint/performance/noBarrelFile: Re-export cn for @/lib/utils consumers
export { cn } from "@portfolio/ui";

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
