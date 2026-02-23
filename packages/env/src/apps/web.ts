import { vercel } from "@t3-oss/env-core/presets-zod";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export function createWebEnv(runtimeEnv: Record<string, string | undefined>) {
  return createEnv({
    server: {
      GITHUB_TOKEN: z.string().min(1).optional(),
    },
    client: {
      NEXT_PUBLIC_UMAMI_URL: z.string().url().optional(),
      NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().min(1).optional(),
    },
    runtimeEnv,
    extends: [vercel()],
  });
}
