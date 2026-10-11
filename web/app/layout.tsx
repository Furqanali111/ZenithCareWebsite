import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd, organizationLd } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Plausible loads only on the production domain.
 *
 * Belt + braces:
 *   - NODE_ENV === "production" rules out `pnpm dev`
 *   - VERCEL_ENV === "production" rules out Vercel preview + development
 *     deploys (which also set NODE_ENV=production because they're real
 *     `next build` outputs)
 *   - Domain env must be set
 *
 * If Vercel isn't the host, VERCEL_ENV is undefined — fall back to
 * NODE_ENV only. If the user also keeps `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
 * unset outside the Production environment on Vercel, either gate alone
 * is sufficient — this is defence in depth.
 */
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
// VERCEL_ENV is set automatically on Vercel builds: "production" |
// "preview" | "development". Undefined on non-Vercel hosts.
const VERCEL_ENV = process.env.VERCEL_ENV;
const plausibleEnabled =
  process.env.NODE_ENV === "production" &&
  (VERCEL_ENV === undefined || VERCEL_ENV === "production") &&
  Boolean(PLAUSIBLE_DOMAIN);

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display face: Plus Jakarta Sans. Mapped to `--font-serif` so existing
// `font-serif` className usages across pages pick it up without a repo-wide
// rename. The token name is a misnomer kept for API stability; the face is
// sans-serif (see redesign notes in globals.css).
const displayFont = Plus_Jakarta_Sans({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Remote Chronic Care Management for U.S. Practices`,
    template: `%s | ${site.name}`,
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
      className={`${inter.variable} ${displayFont.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <JsonLd data={organizationLd()} />
        {plausibleEnabled ? (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
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
