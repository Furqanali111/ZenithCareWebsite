"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

/** Link that marks itself aria-current="page" (nested routes count as current). */
export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const path = usePathname();
  const current = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
  return <Link href={href} aria-current={current ? "page" : undefined} {...props} />;
}

/**
 * Site-nav dropdown (navigation, not an app menu: no role="menu"). Opens on
 * hover, click, or keyboard focus; Esc and focus-out close it. A link trigger
 * (href) opens on focus/hover; a button trigger toggles and exposes aria-expanded.
 */
export function NavDropdown({
  label,
  href,
  panelClassName,
  children,
}: {
  label: string;
  href?: string;
  panelClassName: string;
  children: ReactNode;
}) {
  const path = usePathname();
  // Open state is tied to the page it was opened on, so navigating closes it
  // (the nav stays mounted across pages).
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean) => setOpenAt(v ? path : null);
  const trigger = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  // Esc dismisses even when only the pointer opened it (focus elsewhere).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenAt(null);
      if (wrapper.current?.contains(document.activeElement)) trigger.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const triggerClass =
    "inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-body-ink transition-colors hover:text-brand-accent aria-[current=page]:text-brand-accent aria-[current=page]:underline aria-[current=page]:underline-offset-4";
  const chevron = (
    <svg
      aria-hidden="true"
      className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div
      ref={wrapper}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      {href ? (
        <NavLink ref={trigger} href={href} onFocus={() => setOpen(true)} className={triggerClass}>
          {label}
          {chevron}
        </NavLink>
      ) : (
        <button
          ref={trigger}
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={triggerClass}
        >
          {label}
          {chevron}
        </button>
      )}
      <div className={`${panelClassName} ${open ? "visible opacity-100" : "invisible opacity-0"}`}>{children}</div>
    </div>
  );
}
