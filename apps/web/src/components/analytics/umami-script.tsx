import { env } from "@portfolio/env";
import Script from "next/script";

export function UmamiScript() {
  if (!(env.NEXT_PUBLIC_UMAMI_URL && env.NEXT_PUBLIC_UMAMI_WEBSITE_ID)) {
    return null;
  }

  return (
    <Script
      async
      data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src={env.NEXT_PUBLIC_UMAMI_URL}
      strategy="afterInteractive"
    />
  );
}
