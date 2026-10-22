import Link from "next/link";
import { Phone, Mail, Clock, CalendarCheck } from "lucide-react";
import { site, socials } from "@/lib/site";
import { servicesByCategory, categoryMeta } from "@/lib/services";
import { ContactEmailLink } from "@/components/contact-email-link";

type Item = { label: string; href: string };

// Footer-only curated lists. Only real, shipped pages, no 404s.
// (Pricing, Guides & Downloads, Case Studies, Webinars from the mock have no
// page yet, so they are intentionally omitted until those pages exist.)
const QUICK_LINKS: Item[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "All Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
  { label: "Primary Care", href: "/who-we-serve/primary-care" },
  { label: "Internal Medicine", href: "/who-we-serve/internal-medicine" },
  { label: "Geriatrics", href: "/who-we-serve/geriatrics" },
];

const RESOURCE_LINKS: Item[] = [
  { label: "Blog / Articles", href: "/resources" },
  { label: "ROI Calculator", href: "/roi-calculator" },
  { label: "FAQs", href: "/faq" },
];

const LEGAL_LINKS: Item[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "HIPAA Compliance", href: "/hipaa-compliance" },
  { label: "HIPAA Statement", href: "/hipaa-statement" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

// lucide dropped brand/logo icons, so social marks are inline brand paths
// (24x24 viewBox, simple-icons). We render the user's own social profiles.
const SOCIAL_PATHS: Record<string, string> = {
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  Facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  YouTube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  Instagram:
    "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
};

function BrandIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const toItems = (services: { name: string; slug: string }[]): Item[] =>
  services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }));

/**
 * Site footer: a self-contained dark cyan-ink band (same in light and dark
 * mode). Service columns read the registry by category, so they never drift
 * from the pages. Logo tile is a placeholder Z monogram until the real logo
 * lands.
 */
export function Footer() {
  const activeSocials = socials.filter((s) => s.href);

  // Theme-adaptive: light cream surface in light mode, dark panel in dark mode.
  // surface-tint is one notch off the page bg in each theme, so the footer reads
  // as a distinct surface either way.
  return (
    <footer className="border-t border-border bg-surface-tint text-body-ink">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + blurb + socials */}
          <div className="md:col-span-3">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={`${site.name}, Home`}
            >
              {/* Color logo on the light footer; white when the footer is dark. */}
              <img
                src="/logo.webp"
                alt={site.name}
                width={258}
                height={88}
                className="h-22 w-auto dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-body-ink">
              Remote clinical staffing and care management solutions for U.S.
              healthcare practices.
            </p>

            {activeSocials.length ? (
              <ul className="mt-6 flex items-center gap-3">
                {activeSocials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-body-ink transition-colors hover:border-brand-accent hover:text-brand-accent"
                    >
                      <BrandIcon d={SOCIAL_PATHS[s.label]} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-9 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <FooterColumn label="Quick Links" items={QUICK_LINKS} />
            <FooterColumn
              label={categoryMeta.rpm.label}
              items={toItems(servicesByCategory("rpm"))}
            />
            <FooterColumn
              label={categoryMeta.rcm.label}
              items={toItems(servicesByCategory("rcm"))}
            />
            <FooterColumn
              label={categoryMeta.staffing.label}
              items={toItems(servicesByCategory("staffing"))}
            />
            <FooterColumn label="Resources" items={RESOURCE_LINKS} />
            <ContactColumn />
          </div>
        </div>
      </div>

      {/* Bottom bar: compliance disclaimer, copyright, legal links */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Informational only, not medical, legal, billing, or compliance
            advice. Please do not submit patient-identifying information through
            this site.
          </p>
          <div className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>
              {/* shortcut: hardcoded year, bump each January. Cache Components
                   mode refuses `new Date()` during prerender. */}
              © 2026 {site.legalName}. All rights reserved.
              <span className="mt-1 block">
                Mailing address: {site.mailingAddress}
              </span>
            </p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-brand-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ label, items }: { label: string; items: Item[] }) {
  return (
    <div>
      <FooterHeading>{label}</FooterHeading>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-body-ink transition-colors hover:text-brand-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactColumn() {
  return (
    <div>
      <FooterHeading>Contact</FooterHeading>
      <ul className="mt-3 space-y-3 text-sm text-body-ink">
        {site.phone ? (
          <li className="flex items-start gap-2.5">
            <Phone
              className="mt-0.5 size-4 shrink-0 text-[color:var(--color-gold-500)]"
              aria-hidden="true"
            />
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="transition-colors hover:text-brand-accent"
            >
              {site.phone}
            </a>
          </li>
        ) : null}
        <li className="flex items-start gap-2.5">
          <Mail
            className="mt-0.5 size-4 shrink-0 text-[color:var(--color-gold-500)]"
            aria-hidden="true"
          />
          <ContactEmailLink className="min-w-0 break-words transition-colors hover:text-brand-accent" />
        </li>
        {site.hours ? (
          <li className="flex items-start gap-2.5">
            <Clock
              className="mt-0.5 size-4 shrink-0 text-[color:var(--color-gold-500)]"
              aria-hidden="true"
            />
            <span>{site.hours}</span>
          </li>
        ) : null}
      </ul>
      <Link
        href="/contact"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        <CalendarCheck className="size-4" aria-hidden="true" />
        Book a 15-min call
      </Link>
    </div>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  // h3 (not h2): footer column labels are navigation sub-sections of the page,
  // not document-level sections. Using h2 made them collide with every page's
  // real content-section h2s and tripped SEO-crawler duplicate-h2 warnings on
  // 40%+ of pages.
  return (
    <h3 className="text-sm font-semibold tracking-tight text-ink-strong">
      {children}
    </h3>
  );
}

