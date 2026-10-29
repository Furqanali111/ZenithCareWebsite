import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { nav, site } from "@/lib/site";
import { services, servicesByCategory, categoryMeta, type ServiceCategory } from "@/lib/services";

// Flat services list for the mobile menu, derived from the service registry so
// it never drifts. Built here (server) so the registry stays out of client JS.
const serviceNavItems = [
  { label: "All services", href: "/services" },
  ...services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-24 max-w-[90rem] items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="flex items-center"
          aria-label={`${site.name}, Home`}
        >
          {/* Color logo on the light header; white variant when the header
              turns dark (bg-background is cyan-ink in dark mode). */}
          <img
            src="/logo.webp"
            alt={site.name}
            width={211}
            height={72}
            className="h-18 w-auto dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Desktop nav, shows at lg+ only. The full menu + wordmark needs
            ~782px; at the md (768) tablet width it overflowed, so tablets
            get the hamburger and the full bar appears at lg (1024) where it
            fits comfortably. */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex"
        >
          <ServicesMegaMenu />
          <NavGroup label="Who We Serve" items={nav.whoWeServe} />
          {nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-body-ink transition-colors hover:text-brand-accent"
            >
              {item.label}
            </Link>
          ))}
          <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="h-9 px-4 text-sm shadow-sm shadow-[color:var(--color-brand-900)]/15"
          >
            <Link href="/contact">Book a call</Link>
          </Button>
        </nav>

        {/* Mobile + tablet trigger (below lg) */}
        <MobileMenu
          services={serviceNavItems}
          whoWeServe={nav.whoWeServe}
          main={nav.main}
        />
      </div>
    </header>
  );
}

type Item = { label: string; href: string };

/**
 * Services mega-menu, a two-column panel (Care Management /
 * Virtual Staffing & Admin Support), each column listing its full-name
 * services and a "See all" link. Reads the service registry by category, so
 * it never drifts from the pages. Hover + keyboard (:focus-within) open it.
 */
function ServicesMegaMenu() {
  return (
    <div className="group relative">
      {/* Clickable, goes to the /services overview; hover/focus still opens the
          mega-menu (the panel is a group-hover sibling). */}
      <Link
        href="/services"
        className="inline-flex items-center gap-1 text-sm font-medium text-body-ink transition-colors hover:text-brand-accent"
      >
        Services
        <svg
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:rotate-180"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      {/* Wide 3-column panel. Anchored at the trigger then shifted left so its
          left edge lands on the nav's content edge, gives roomy columns that
          hold the full service names on one line, and keeps the panel on-screen
          at every width down to the lg breakpoint (the shift is the fixed
          distance from the nav's left edge to the Services trigger).
          shortcut: 286px assumes the current wordmark width; retune if it changes. */}
      <div
        role="menu"
        className="invisible absolute left-0 top-full z-50 w-[min(94vw,60rem)] -translate-x-[286px] pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 rounded-xl border border-border bg-card p-4 shadow-lg shadow-[color:var(--color-brand-900)]/15 sm:grid-cols-3 dark:bg-[color:var(--color-brand-800)]">
          <MegaColumn category="rpm" />
          <MegaColumn category="rcm" />
          <MegaColumn category="staffing" />
        </div>
      </div>
    </div>
  );
}

function MegaColumn({ category }: { category: ServiceCategory }) {
  const meta = categoryMeta[category];
  const items = servicesByCategory(category);
  return (
    <div>
      {/* Clickable category header that goes to the matching section on the overview. */}
      <Link
        href={meta.href}
        role="menuitem"
        className="group/cat block rounded-lg px-3 py-1.5 transition-colors hover:bg-[color:var(--color-brand-50)] dark:hover:bg-white/10"
      >
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent">
          {meta.label}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {meta.blurb}
        </span>
      </Link>
      <div className="mt-1">
        {items.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            role="menuitem"
            className="block rounded-lg px-3 py-1.5 text-sm text-ink-strong transition-colors hover:bg-[color:var(--color-brand-50)] hover:text-brand-accent dark:hover:bg-white/10"
          >
            {s.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * One nav slot. One item: plain link. Several: hover-reveal menu.
 * Keyboard: focus the label span, panel opens via :focus-within.
 */
function NavGroup({ label, items }: { label: string; items: readonly Item[] }) {
  if (items.length === 1) {
    const only = items[0];
    return (
      <Link
        href={only.href}
        className="text-sm font-medium text-body-ink transition-colors hover:text-brand-accent"
      >
        {label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <span
        tabIndex={0}
        className="inline-flex cursor-default items-center gap-1 text-sm font-medium text-body-ink transition-colors hover:text-brand-accent"
      >
        {label}
        <svg
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:rotate-180"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {/* Dropdown panel. `pt-3` on the OUTER wrapper (not margin on the card)
          keeps the cursor-hit area continuous between trigger and card, 
          `mt-3` previously left a 12px dead-zone that closed the menu. */}
      <div
        role="menu"
        className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        <div className="rounded-xl border border-border bg-card p-2 shadow-lg shadow-[color:var(--color-brand-900)]/15 dark:bg-[color:var(--color-brand-800)]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block rounded-lg px-3 py-2 text-sm text-ink-strong hover:bg-[color:var(--color-brand-50)] hover:text-brand-accent dark:hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
