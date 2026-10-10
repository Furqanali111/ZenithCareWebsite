import Link from "next/link";
import { mailtoHref, nav, site, whatsappHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[color:var(--color-surface-50)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-serif text-lg font-semibold tracking-tight text-[color:var(--color-brand-900)]"
          >
            {site.name}
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {site.tagline}
          </p>
          <ul className="mt-6 space-y-1 text-sm">
            <li>
              <a
                href={whatsappHref()}
                className="text-[color:var(--color-brand-700)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us
              </a>
            </li>
            <li>
              <a
                href={mailtoHref()}
                className="text-[color:var(--color-brand-700)] hover:underline"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <FooterGroup label="Services" items={nav.services} />
          <FooterGroup label="Who We Serve" items={nav.whoWeServe} />
        </div>

        <div>
          <FooterGroup label="Company" items={nav.main} />
          <FooterGroup label="Legal" items={nav.legal} />
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
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-[color:var(--color-ink-900)] hover:text-[color:var(--color-brand-700)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
