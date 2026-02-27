import { vercel } from "@t3-oss/env-core/presets-zod";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  server: {
    GITHUB_TOKEN: z.string().optional(),
    UMAMI_WEBSITE_ID: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_UMAMI_URL: z.string().url().optional(),
  },

  shared: {
    NEXT_TELEMETRY_DISABLED: z.enum(["0", "1"]).optional(),
    TURBO_TELEMETRY_DISABLED: z.enum(["0", "1"]).optional(),
  },

  runtimeEnv: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED,
    TURBO_TELEMETRY_DISABLED: process.env.TURBO_TELEMETRY_DISABLED,
  },

  extends: [vercel()],
});
