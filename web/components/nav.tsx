"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { nav, site } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name} — Home`}
        >
          <WordmarkGlyph />
          <span className="hidden font-serif text-[17px] font-semibold tracking-tight text-brand-ink sm:inline">
            {site.name}
          </span>
        </Link>

        {/* Desktop nav — shows at lg+ only. The full menu + wordmark needs
            ~782px; at the md (768) tablet width it overflowed, so tablets
            get the hamburger and the full bar appears at lg (1024) where it
            fits comfortably. */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex"
        >
          <NavGroup label="Services" items={nav.services} />
          <NavGroup label="Who We Serve" items={nav.whoWeServe} />
          {nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--color-ink-700)] transition-colors hover:text-brand-accent dark:text-[color:var(--color-surface-50)]"
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
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="font-serif text-base">
                {site.name}
              </SheetTitle>
            </SheetHeader>
            <nav
              aria-label="Mobile"
              className="mt-6 flex flex-col gap-1 px-4"
            >
              <MobileGroup label="Services" items={nav.services} close={() => setOpen(false)} />
              <MobileGroup label="Who We Serve" items={nav.whoWeServe} close={() => setOpen(false)} />
              {nav.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-4 h-10 text-sm">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Book a call
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

/**
 * Tiny inline SVG wordmark glyph — the Z monogram inside a rounded square.
 * Honest geometric mark, not an "icon" stand-in. Scales via currentColor.
 */
function WordmarkGlyph() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-9 items-center justify-center rounded-xl bg-[color:var(--color-brand-900)] text-[color:var(--color-teal-400)]"
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
  );
}

type Item = { label: string; href: string };

/**
 * One nav slot. One item → plain link. Multiple → hover-reveal menu.
 * Keyboard: focus the label span, panel opens via :focus-within.
 */
function NavGroup({ label, items }: { label: string; items: readonly Item[] }) {
  if (items.length === 1) {
    const only = items[0];
    return (
      <Link
        href={only.href}
        className="text-sm font-medium text-[color:var(--color-ink-700)] transition-colors hover:text-brand-accent"
      >
        {label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <span
        tabIndex={0}
        className="inline-flex cursor-default items-center gap-1 text-sm font-medium text-[color:var(--color-ink-700)] transition-colors hover:text-brand-accent dark:text-[color:var(--color-surface-50)]"
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
          keeps the cursor-hit area continuous between trigger and card —
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

function MobileGroup({
  label,
  items,
  close,
}: {
  label: string;
  items: readonly Item[];
  close: () => void;
}) {
  if (items.length === 1) {
    const only = items[0];
    return (
      <Link
        href={only.href}
        onClick={close}
        className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
      >
        {label}
      </Link>
    );
  }
  return (
    <div className="mb-2">
      <div className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={close}
          className="block rounded-md px-2 py-2 text-sm hover:bg-muted"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
