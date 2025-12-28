import Script from "next/script";
import { env } from "@/env";

export function UmamiScript() {
  return (
    <Script
      async
      data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src={env.NEXT_PUBLIC_UMAMI_URL}
      strategy="afterInteractive"
    />
  );
}
