import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content is read from disk at build time; ship it with server functions too
  // in case a route is ever rendered on demand.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
