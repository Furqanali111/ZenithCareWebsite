import Link from "next/link";
import { ShieldCheck, Stethoscope, Database } from "lucide-react";
import { mailtoHref, nav, site, whatsappHref } from "@/lib/site";

export function Footer() {
  const hasWhatsApp = Boolean(site.whatsappNumber);
  return (
    <footer className="border-t border-border bg-surface-tint">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12 md:gap-10 md:py-20">
        {/* Brand + direct lines + micro trust marks */}
        <div className="md:col-span-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label={`${site.name} — Home`}
          >
            <span
              aria-hidden="true"
              className="relative inline-flex size-9 items-center justify-center rounded-xl bg-[color:var(--color-brand-900)] text-[color:var(--color-gold-500)]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-[18px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6h12L6 18h12"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-serif text-lg font-semibold tracking-tight text-brand-ink">
              {site.name}
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-body-ink">
            {site.tagline}
          </p>

          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {hasWhatsApp ? (
              <li>
                <a
                  href={whatsappHref()}
                  className="font-medium text-brand-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={mailtoHref()}
                className="font-medium text-brand-accent hover:underline"
              >
                {site.email}
              </a>
            </li>
          </ul>

          <ul className="mt-7 grid grid-cols-1 gap-2 text-xs text-body-ink sm:grid-cols-3">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck
                className="size-4 text-brand-accent"
                aria-hidden="true"
              />
              HIPAA Business Associate
            </li>
            <li className="inline-flex items-center gap-2">
              <Stethoscope
                className="size-4 text-brand-accent"
                aria-hidden="true"
              />
              PharmD-led clinical team
            </li>
            <li className="inline-flex items-center gap-2">
              <Database
                className="size-4 text-brand-accent"
                aria-hidden="true"
              />
              Inside your EHR
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <FooterGroup label="Services" items={nav.services} />
          <FooterGroup label="Who We Serve" items={nav.whoWeServe} />
        </div>

        <div className="md:col-span-4">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-2">
            <FooterGroup label="Company" items={nav.main} />
            <FooterGroup label="Legal" items={nav.legal} />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            {/* shortcut: hardcoded year, bump each January. Next 16 Cache
                 Components mode refuses `new Date()` during prerender. */}
            © 2026 Zenith Care Solutions LLC. All rights reserved.
          </p>
          <p className="max-w-xl md:text-right">
            Informational only — not medical, legal, billing, or compliance advice.
            Please do not submit patient-identifying information through this site.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  label,
  items,
}: {
  label: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-strong">
        {label}
      </div>
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
