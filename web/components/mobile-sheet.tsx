"use client";

import Link from "next/link";
import type { RefObject } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export type NavItem = { label: string; href: string };

/**
 * The slide-out mobile menu. Loaded on demand by `MobileMenu` (first tap, or
 * hover/focus/touch of the menu button), so the dialog, focus-trap and scroll
 * lock code is not part of every page's initial JavaScript.
 */
export default function MobileSheet({
  open,
  onOpenChange,
  returnFocusRef,
  services,
  whoWeServe,
  main,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  services: readonly NavItem[];
  whoWeServe: readonly NavItem[];
  main: readonly NavItem[];
}) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-80"
        // No SheetTrigger wraps the menu button, so hand focus back to it here.
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-base">{site.name}</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1 px-4">
          <MobileGroup label="Services" items={services} close={close} />
          <MobileGroup label="Who We Serve" items={whoWeServe} close={close} />
          {main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-4 h-10 text-sm">
            <Link href="/contact" onClick={close}>
              Book a call
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileGroup({
  label,
  items,
  close,
}: {
  label: string;
  items: readonly NavItem[];
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
