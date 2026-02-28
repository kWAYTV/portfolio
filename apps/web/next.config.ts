import "@repo/env/web";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/modules/i18n/request.ts");
const withMDX = createMDX();

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  typedRoutes: true,
  reactCompiler: true,
};

export default withMDX(withNextIntl(nextConfig));
