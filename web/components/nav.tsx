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
import { nav, site } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-[color:var(--color-brand-900)]"
          aria-label={`${site.name} — Home`}
        >
          {site.name}
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
        >
          <NavGroup label="Services" items={nav.services} />
          <NavGroup label="Who We Serve" items={nav.whoWeServe} />
          {nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--color-ink-900)] hover:text-[color:var(--color-brand-700)]"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/contact">Book a call</Link>
          </Button>
        </nav>

        {/* Mobile trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
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
              <Button asChild className="mt-4">
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

type Item = { label: string; href: string };

/**
 * One nav slot. One item → plain link. Multiple → hover-reveal menu.
 * The label is a <span tabIndex=0>, not a <button>, because the only
 * interaction is "receive focus so the menu reveals"; promising a button
 * action we never implement would be an a11y bug.
 *
 * shortcut: Tailwind group hover/focus is enough for 2–4 items. Upgrade to
 * the installed shadcn navigation-menu if we need keyboard arrow traversal
 * or a group grows past 5 items.
 */
function NavGroup({ label, items }: { label: string; items: readonly Item[] }) {
  if (items.length === 1) {
    const only = items[0];
    return (
      <Link
        href={only.href}
        className="text-sm font-medium text-[color:var(--color-ink-900)] hover:text-[color:var(--color-brand-700)]"
      >
        {label}
      </Link>
    );
  }
  return (
    <div className="group relative">
      <span
        tabIndex={0}
        className="cursor-default text-sm font-medium text-[color:var(--color-ink-900)] hover:text-[color:var(--color-brand-700)]"
      >
        {label}
      </span>
      <div
        role="menu"
        className="invisible absolute left-1/2 top-full z-50 mt-3 w-60 -translate-x-1/2 rounded-md border border-border bg-background p-2 opacity-0 shadow-md transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            className="block rounded px-3 py-2 text-sm hover:bg-muted"
          >
            {item.label}
          </Link>
        ))}
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
