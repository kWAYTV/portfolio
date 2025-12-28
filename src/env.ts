import { vercel } from "@t3-oss/env-core/presets-zod";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_UMAMI_URL: z.string().url(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().min(1),
  },
  runtimeEnv: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  },
  extends: [vercel()],
});
