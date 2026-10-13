import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/**
 * Security headers applied to every response.
 * Keep allowlists tight; extend only when a feature actually needs it.
 *
 * shortcut: CSP uses 'unsafe-inline' for scripts + styles so Next's inline
 * runtime boot and Tailwind's inline critical CSS keep working out of the
 * box. Tighten with nonce-based CSP + strict-dynamic in a dedicated
 * security-hardening PR once Phase 2 features (Calendly, Formspree) are
 * wired and we can allowlist their hosts in one pass.
 */
const isDev = process.env.NODE_ENV !== "production";

// Hosts the browser is allowed to load scripts from.
// - vercel-scripts: Web Vitals / Speed Insights
// - plausible: analytics (optional, loaded only when env var set — see layout)
// - assets.calendly.com: Calendly inline-widget loader
const scriptHosts =
  "https://va.vercel-scripts.com https://plausible.io https://assets.calendly.com";
const scriptSrc = isDev
  ? `'self' 'unsafe-inline' 'unsafe-eval' ${scriptHosts}`
  : `'self' 'unsafe-inline' ${scriptHosts}`;

// Hosts the browser is allowed to send fetch/XHR/beacon to.
// - formspree.io: contact form submissions
// - calendly.com: inline widget telemetry
const connectSrc =
  "'self' https://vitals.vercel-insights.com https://vercel.live https://plausible.io https://formspree.io https://calendly.com";

// Hosts allowed to embed as <iframe>. Calendly serves its booking widget
// from calendly.com as an iframe inside the inline-widget container.
const frameSrc = "https://calendly.com";

// Hosts allowed as the destination of a <form action="...">. We POST via
// fetch (connect-src), but keep form-action tight in case a future form
// submits natively.
const formAction = "'self' https://formspree.io";

// Image hosts (Calendly serves favicons / avatars from calendly.com).
const imgSrc = "'self' data: blob: https://*.calendly.com";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
    // NOTE: add `; preload` and submit to hstspreload.org only after
    //       30 days of clean HTTPS operation per WebSiteDoc/02-technical-requirements.md §7.1.
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src ${imgSrc}`,
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      `frame-src ${frameSrc}`,
      "object-src 'none'",
      "base-uri 'self'",
      `form-action ${formAction}`,
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Treat .md and .mdx files alongside .tsx as pages/components.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  /**
   * www → non-www canonical redirect (308 Permanent Redirect).
   *
   * Google treats `www.thezcs.com` and `thezcs.com` as separate origins.
   * Without this redirect, any URL inspected as `www.thezcs.com/*` will be
   * "unknown to Google" because:
   *   - The sitemap lists only `thezcs.com` URLs.
   *   - Canonical tags point to `thezcs.com`.
   *   - Google sees zero signal tying the www variant to the non-www property.
   *
   * A 308 (permanent, method-preserving) consolidates all crawl budget, link
   * equity, and indexing signals onto the single canonical origin.
   *
   * On Vercel this redirect runs at the Edge before any page is rendered, so
   * it costs essentially zero compute.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.thezcs.com" }],
        destination: "https://thezcs.com/:path*",
        permanent: true, // 308 — preserves POST method; same effect as 301 for GET/HEAD
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all page/API routes. Exclude static and
        // crawler-critical assets (favicon, manifests, sitemap, robots) so
        // HEAD requests from Googlebot never hit the App Router page pipeline,
        // which rejects HEAD with 405 under Next.js 16 strictRouteMatching.
        source:
          "/((?!favicon\\.ico|apple-icon\\.png|icon\\.svg|site\\.webmanifest|sitemap\\.xml|robots\\.txt|\\.well-known).*)",
        headers: securityHeaders,
      },
      {
        // Static / meta assets still need a minimal set of headers:
        // no sniffing, strict transport, and referrer policy.
        // X-Frame-Options and CSP frame-ancestors are intentionally omitted
        // here because they don't apply to binary assets.
        source: "/favicon.ico",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/apple-icon.png",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/site.webmanifest",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

/**
 * MDX plugin set is deliberately empty for v1. Add remark-gfm / rehype-slug
 * / rehype-pretty-code when the first post actually needs the feature.
 */
const withMDX = createMDX({});

export default withMDX(nextConfig);
