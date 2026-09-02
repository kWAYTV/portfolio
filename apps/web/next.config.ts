import "@repo/env/web";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/modules/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  devIndicators: false,
  reactCompiler: true,
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
