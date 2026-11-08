"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, MessageCircle, X } from "lucide-react";
import { track } from "@/components/conversion-tracking";
import { FaqAnswer } from "@/components/faq-answer";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/lib/faq";
import { CPT_RATES } from "@/lib/roi";
import { mailtoHref, site, whatsappHref } from "@/lib/site";

type View =
  | { kind: "menu" }
  | { kind: "topics" }
  | { kind: "questions"; category: string }
  | { kind: "answer"; id: string }
  | { kind: "revenue" }
  | { kind: "estimate"; patients: number }
  | { kind: "services" }
  | { kind: "service"; id: string }
  | { kind: "contact" };

const MENU: { label: string; next: View }[] = [
  { label: "Estimate my revenue", next: { kind: "revenue" } },
  { label: "Find the right service", next: { kind: "services" } },
  { label: "Browse common questions", next: { kind: "topics" } },
  { label: "Talk to a person", next: { kind: "contact" } },
];

const PANEL_SIZES = [50, 100, 200, 400] as const;

const SERVICES = [
  {
    id: "care",
    label: "Care management for chronic patients",
    name: "Care management",
    href: "/services/care-management",
    blurb: "Monthly coordination for patients with two or more chronic conditions, delivered inside your EHR.",
  },
  {
    id: "billing",
    label: "Billing and revenue cycle help",
    name: "Revenue cycle management",
    href: "/services/revenue-cycle-management",
    blurb: "Billing, coding, and denial follow-up so your practice collects what it has earned.",
  },
  {
    id: "staffing",
    label: "Extra clinical or admin staff",
    name: "Virtual staffing",
    href: "/services/virtual-staffing",
    blurb: "Trained clinical and administrative staff who work inside your EHR, under one BAA.",
  },
] as const;

const chip =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-background px-4 text-sm font-medium text-brand-accent transition-colors hover:bg-muted focus-visible:outline-2";
const row =
  "flex min-h-11 w-full items-center rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-ink-strong transition-colors hover:bg-muted";
const quiet =
  "inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-medium text-body-ink transition-colors hover:text-brand-ink";
const bubble = "rounded-xl bg-surface-tint p-3 text-sm";

// Stagger index for the rise-in animation (see .chat-rise in globals.css).
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/**
 * Scripted guide. No text input, no network, no LLM: every path is a fixed set
 * of buttons, so no patient information can be typed into it. FAQ answers come
 * from content/faq.json via the layout; the revenue estimate uses lib/roi.
 */
export function FaqChatbot({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState(false);
  // Close once navigation lands; the panel stays visible while a slow page loads.
  const pathname = usePathname();
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }
  const [view, setView] = useState<View>({ kind: "menu" });
  const fab = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const categories = useMemo(
    () => Array.from(new Set(items.map((q) => q.category))),
    [items],
  );

  function toggle(next: boolean) {
    setOpen(next);
    if (next) {
      track("chatbot_open");
      requestAnimationFrame(() => panel.current?.focus());
    } else {
      fab.current?.focus();
    }
  }

  function go(next: View) {
    moved.current = true;
    setView(next);
  }

  // After a button press the old button disappears, so move focus to the new content.
  useEffect(() => {
    if (moved.current) body.current?.focus();
  }, [view]);

  const item = view.kind === "answer" ? items.find((q) => q.id === view.id) : undefined;
  const service = view.kind === "service" ? SERVICES.find((s) => s.id === view.id) : undefined;

  const bookCall = (
    <Button
      asChild
      className="h-11 bg-[color:var(--color-gold-500)] px-5 text-sm font-semibold text-[color:var(--color-brand-900)] shadow-[var(--shadow-lift)] hover:bg-[color:var(--color-gold-500)]/90"
    >
      <Link href="/contact" onClick={() => track("chatbot_book_click")}>
        Book a 15-minute call
      </Link>
    </Button>
  );
  const menuLink = (
    <button type="button" className={quiet} onClick={() => go({ kind: "menu" })}>
      <ChevronLeft className="size-4" aria-hidden="true" />
      Main menu
    </button>
  );
  const actions = (n: number, children: ReactNode) => (
    <div
      className="chat-rise sticky -bottom-4 -mx-4 flex flex-wrap items-center gap-x-3 border-t border-border bg-card px-4 pb-3 pt-3"
      style={i(n)}
    >
      {children}
    </div>
  );

  return (
    <aside aria-label="Zenith chat">
      <div
        ref={panel}
        id="faq-chat-panel"
        role="dialog"
        aria-labelledby="faq-chat-title"
        tabIndex={-1}
        inert={!open}
        data-open={open}
        onKeyDown={(e) => {
          if (e.key === "Escape") toggle(false);
        }}
        className="chat-panel fixed bottom-24 right-4 z-50 flex max-h-[min(34rem,calc(100dvh-8rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[var(--shadow-float)] outline-none sm:right-6"
      >
        <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
          <h2 id="faq-chat-title" className="font-serif text-base font-semibold">
            Ask Zenith
          </h2>
          <button
            type="button"
            onClick={() => toggle(false)}
            aria-label="Close chat"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div
          ref={body}
          role="group"
          aria-labelledby="faq-chat-title"
          tabIndex={-1}
          key={JSON.stringify(view)}
          className="flex-1 space-y-3 overflow-y-auto p-4 outline-none"
        >
          {view.kind === "menu" && (
            <>
              <p className={`chat-rise ${bubble} font-medium text-ink-strong`} style={i(0)}>
                Hi. What would you like to do?
              </p>
              <ul className="space-y-2">
                {MENU.map((m, n) => (
                  <li key={m.label} className="chat-rise" style={i(n + 1)}>
                    <button type="button" className={row} onClick={() => go(m.next)}>
                      {m.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {view.kind === "topics" && (
            <>
              <p className={`chat-rise ${bubble} font-medium text-ink-strong`} style={i(0)}>
                Pick a topic.
              </p>
              <div className="chat-rise flex flex-wrap gap-2" style={i(1)}>
                {categories.map((c) => (
                  <button key={c} type="button" className={chip} onClick={() => go({ kind: "questions", category: c })}>
                    {c}
                  </button>
                ))}
              </div>
              {menuLink}
            </>
          )}

          {view.kind === "questions" && (
            <>
              <p className="chat-rise text-sm font-medium text-ink-strong" style={i(0)}>
                {view.category}: pick a question.
              </p>
              <ul className="space-y-2">
                {items
                  .filter((q) => q.category === view.category)
                  .map((q, n) => (
                    <li key={q.id} className="chat-rise" style={i(n + 1)}>
                      <button type="button" className={row} onClick={() => go({ kind: "answer", id: q.id })}>
                        {q.question}
                      </button>
                    </li>
                  ))}
              </ul>
              <button type="button" className={quiet} onClick={() => go({ kind: "topics" })}>
                <ChevronLeft className="size-4" aria-hidden="true" />
                All topics
              </button>
            </>
          )}

          {view.kind === "answer" && item && (
            <>
              <p className="chat-rise text-sm font-semibold text-brand-ink" style={i(0)}>
                {item.question}
              </p>
              <p className={`chat-rise ${bubble} leading-relaxed text-body-ink`} style={i(1)}>
                <FaqAnswer text={item.answer} />
              </p>
              {actions(
                2,
                <>
                  {bookCall}
                  <Link href="/faq" className={quiet}>
                    Read the full FAQ
                  </Link>
                  <button type="button" className={quiet} onClick={() => go({ kind: "questions", category: item.category })}>
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    More in {item.category}
                  </button>
                </>,
              )}
            </>
          )}

          {view.kind === "revenue" && (
            <>
              <p className={`chat-rise ${bubble} font-medium text-ink-strong`} style={i(0)}>
                How many patients could you enroll in chronic care management?
              </p>
              <div className="chat-rise flex flex-wrap gap-2" style={i(1)}>
                {PANEL_SIZES.map((n) => (
                  <button key={n} type="button" className={`${chip} tabular-nums`} onClick={() => go({ kind: "estimate", patients: n })}>
                    About {n}
                  </button>
                ))}
              </div>
              {menuLink}
            </>
          )}

          {view.kind === "estimate" && (
            <>
              <p className="chat-rise text-sm text-body-ink" style={i(0)}>
                About {view.patients} enrolled patients at the base code (CPT 99490)
              </p>
              <p className="chat-rise font-serif text-4xl font-semibold tabular-nums text-brand-ink" style={i(1)}>
                ${(view.patients * CPT_RATES["99490"]).toLocaleString("en-US")}
                <span className="ml-2 text-base font-medium text-body-ink">/ month</span>
              </p>
              <p className="chat-rise text-xs leading-relaxed text-muted-foreground" style={i(2)}>
                Representative Medicare reimbursement to your practice, before add-on codes. Actual results vary.
              </p>
              {actions(
                3,
                <>
                  {bookCall}
                  <Link href="/roi-calculator" className={quiet}>
                    Open the calculator
                  </Link>
                  <button type="button" className={quiet} onClick={() => go({ kind: "revenue" })}>
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Try another size
                  </button>
                </>,
              )}
            </>
          )}

          {view.kind === "services" && (
            <>
              <p className={`chat-rise ${bubble} font-medium text-ink-strong`} style={i(0)}>
                What do you need help with?
              </p>
              <ul className="space-y-2">
                {SERVICES.map((s, n) => (
                  <li key={s.id} className="chat-rise" style={i(n + 1)}>
                    <button type="button" className={row} onClick={() => go({ kind: "service", id: s.id })}>
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
              {menuLink}
            </>
          )}

          {view.kind === "service" && service && (
            <>
              <p className="chat-rise text-sm font-semibold text-brand-ink" style={i(0)}>
                {service.name}
              </p>
              <p className={`chat-rise ${bubble} leading-relaxed text-body-ink`} style={i(1)}>
                {service.blurb}
              </p>
              {actions(
                2,
                <>
                  {bookCall}
                  <Link href={service.href} className={quiet}>
                    See the service
                  </Link>
                  <button type="button" className={quiet} onClick={() => go({ kind: "services" })}>
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Other services
                  </button>
                </>,
              )}
            </>
          )}

          {view.kind === "contact" && (
            <>
              <p className={`chat-rise ${bubble} font-medium text-ink-strong`} style={i(0)}>
                Reach us any way you like. We reply within one business day.
              </p>
              <div className="chat-rise flex flex-col items-start gap-2" style={i(1)}>
                {bookCall}
                {site.whatsappNumber ? (
                  <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={row}>
                    Message us on WhatsApp
                  </a>
                ) : null}
                <a href={mailtoHref()} className={row}>
                  Email {site.email}
                </a>
              </div>
              {menuLink}
            </>
          )}
        </div>

        <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          General information only. Please do not share patient information.
        </p>
      </div>

      <button
        ref={fab}
        type="button"
        onClick={() => toggle(!open)}
        aria-expanded={open}
        aria-controls="faq-chat-panel"
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-[scale,background-color] duration-150 hover:bg-[color:var(--color-brand-700)] focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-[0.96] motion-reduce:active:scale-100 sm:right-6"
      >
        <span className="chat-icon" data-on={!open} aria-hidden="true">
          <MessageCircle className="size-6" />
        </span>
        <span className="chat-icon" data-on={open} aria-hidden="true">
          <X className="size-6" />
        </span>
      </button>
    </aside>
  );
}
