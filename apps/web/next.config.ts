import "@repo/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  typedRoutes: true,
  reactCompiler: true,
};

export default nextConfig;
