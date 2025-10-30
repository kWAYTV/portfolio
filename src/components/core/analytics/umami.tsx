import Script from "next/script";

import { env } from "@/env";

// biome-ignore lint/suspicious/useAwait: "use cache" directive requires async function
export async function AnalyticsScript() {
  "use cache";

  return (
    <Script
      async
      data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src="https://metrics.kway.club/script.js"
      type="text/javascript"
    />
  );
}
