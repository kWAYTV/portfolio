import "@portfolio/env/web";
import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  cacheComponents: true,
  devIndicators: false,
};

const withMDX = createMDX({ configPath: "source.config.ts" });

export default withMDX(config);
