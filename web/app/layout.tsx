import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ConversionTracking } from "@/components/conversion-tracking";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Google Analytics 4 loads only on the production domain.
 *
 * Belt + braces:
 *   - NODE_ENV === "production" rules out `pnpm dev`
 *   - VERCEL_ENV === "production" rules out Vercel preview + development
 *     deploys (which also set NODE_ENV=production because they're real
 *     `next build` outputs)
 *   - Measurement ID env must be set
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel under the Production
 * environment only. VERCEL_ENV is set automatically by Vercel.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// VERCEL_ENV is set automatically on Vercel builds: "production" |
// "preview" | "development". Undefined on non-Vercel hosts.
const VERCEL_ENV = process.env.VERCEL_ENV;
const gaEnabled =
  process.env.NODE_ENV === "production" &&
  (VERCEL_ENV === undefined || VERCEL_ENV === "production") &&
  Boolean(GA_ID);

// Body face: Inter, neutral, highly legible, pairs with the grotesk display.
const bodyFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display face: Space Grotesk, a modern grotesk (v3 "Warm Cyan"). Mapped to
// `--font-serif`, which the existing `font-serif` headings consume, so the
// whole site picks up the new display face without a repo-wide rename. (Space
// Grotesk has no italic axis; the hero's emphasis word renders as a synthesized
// oblique, which is acceptable for a single accent word.)
const displayFont = Space_Grotesk({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  manifest: "/site.webmanifest",
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, Care Management, RCM & Virtual Staffing for U.S. Practices`,
    template: `%s | ${site.name}`,
  },
  icons: {
    // Next.js App Router automatically serves app/favicon.ico at /favicon.ico
    // and app/apple-icon.png at /apple-icon.png as special metadata files.
    // Do NOT override them with explicit paths here — that re-routes the
    // requests through the page pipeline and can cause 405 errors on HEAD
    // requests (e.g. from Googlebot) under Next.js 16 strictRouteMatching.
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  description: site.tagline,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {gaEnabled ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
            <ConversionTracking />
          </>
        ) : null}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
          >
            Skip to main content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
