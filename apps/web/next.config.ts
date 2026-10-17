import "@repo/env/web";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/modules/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  devIndicators: false,
  experimental: {
    // Lets `@next/playwright` `instant()` lock dynamic data in measured builds only.
    exposeTestingApiInProductionBuild: process.env.EXPOSE_TESTING_API === "1",
    // One ~9KB stylesheet: inlining it removes the only render-blocking request.
    inlineCss: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
