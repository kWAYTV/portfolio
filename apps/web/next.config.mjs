import "@portfolio/env";
import { createMDX } from "fumadocs-mdx/next";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  cacheComponents: false,
  devIndicators: false,
};

const withNextIntl = createNextIntlPlugin("./modules/i18n/request.ts");
const withMDX = createMDX({ configPath: "source.config.ts" });

export default withNextIntl(withMDX(config));
