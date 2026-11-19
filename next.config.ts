import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Which outside sites the browser may load things from. Anything not listed here is
// refused, so an injected script or a tampered link can't run or send data elsewhere.
// Adding a new tool (a chat widget, a video embed, Cal.com embed)? Add its domain here.
const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' is needed for Next.js's own page-start scripts and the GA/Meta snippets.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://*.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
  "font-src 'self' data: https://api.fontshare.com https://cdn.fontshare.com",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://www.facebook.com",
  `connect-src 'self'${isDev ? " ws:" : ""} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.facebook.com https://connect.facebook.net`,
  "frame-src 'self'",
  "frame-ancestors 'none'", // no other site may show this one inside a frame
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" }, // older browsers' version of frame-ancestors
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  // Content is read from disk at build time; ship it with server functions too
  // in case a route is ever rendered on demand.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
