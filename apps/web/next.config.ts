import "@repo/env/web";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  devIndicators: false,
  typedRoutes: true,
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
