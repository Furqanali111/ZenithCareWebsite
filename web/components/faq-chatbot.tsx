"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, MessageCircle, X } from "lucide-react";
import { track } from "@/components/conversion-tracking";
import { FaqAnswer } from "@/components/faq-answer";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/lib/faq";

type View =
  | { kind: "topics" }
  | { kind: "questions"; category: string }
  | { kind: "answer"; id: string };

const chip =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-background px-4 text-sm font-medium text-brand-accent transition-colors hover:bg-muted focus-visible:outline-2";
const row =
  "flex min-h-11 w-full items-center rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-ink-strong transition-colors hover:bg-muted";
const quiet =
  "inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-medium text-body-ink transition-colors hover:text-brand-ink";

/**
 * Scripted FAQ chatbot. No text input, no network, no LLM: it only walks the
 * visitor through the same content as /faq, so no patient information can be
 * typed into it. Answers come from content/faq.json via the layout.
 */
export function FaqChatbot({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>({ kind: "topics" });
  const fab = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
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

  const item = view.kind === "answer" ? items.find((i) => i.id === view.id) : undefined;
  const list = view.kind === "questions" ? items.filter((i) => i.category === view.category) : [];

  return (
    <aside aria-label="FAQ chat">
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
            Zenith FAQ
          </h2>
          <button
            type="button"
            onClick={() => toggle(false)}
            aria-label="Close FAQ chat"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div
          ref={body}
          tabIndex={-1}
          key={JSON.stringify(view)}
          className="flex-1 space-y-3 overflow-y-auto p-4 outline-none"
        >
          {view.kind === "topics" && (
            <>
              <p className="chat-rise rounded-xl bg-surface-tint p-3 text-sm font-medium text-ink-strong" style={{ "--i": 0 } as React.CSSProperties}>
                Hi. What would you like to know about care management?
              </p>
              <div className="chat-rise flex flex-wrap gap-2" style={{ "--i": 1 } as React.CSSProperties}>
                {categories.map((c) => (
                  <button key={c} type="button" className={chip} onClick={() => go({ kind: "questions", category: c })}>
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          {view.kind === "questions" && (
            <>
              <p className="chat-rise text-sm font-medium text-ink-strong" style={{ "--i": 0 } as React.CSSProperties}>
                {view.category}: pick a question.
              </p>
              <ul className="space-y-2">
                {list.map((q, n) => (
                  <li key={q.id} className="chat-rise" style={{ "--i": n + 1 } as React.CSSProperties}>
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
              <p className="chat-rise text-sm font-semibold text-brand-ink" style={{ "--i": 0 } as React.CSSProperties}>
                {item.question}
              </p>
              {/* Links inside the answer navigate away, so close the panel with them. */}
              <p
                className="chat-rise rounded-xl bg-surface-tint p-3 text-sm leading-relaxed text-body-ink"
                style={{ "--i": 1 } as React.CSSProperties}
                onClick={(e) => {
                  if ((e.target as Element).closest("a")) toggle(false);
                }}
              >
                <FaqAnswer text={item.answer} />
              </p>
              <div className="chat-rise sticky -bottom-4 -mx-4 flex flex-wrap items-center gap-x-3 border-t border-border bg-card px-4 pb-3 pt-3" style={{ "--i": 2 } as React.CSSProperties}>
                <Button
                  asChild
                  className="h-11 bg-[color:var(--color-gold-500)] px-5 text-sm font-semibold text-[color:var(--color-brand-900)] shadow-[var(--shadow-lift)] hover:bg-[color:var(--color-gold-500)]/90"
                >
                  <Link href="/contact" onClick={() => { track("chatbot_book_click"); toggle(false); }}>
                    Book a 15-minute call
                  </Link>
                </Button>
                <Link href="/faq" className={quiet} onClick={() => toggle(false)}>
                  Read the full FAQ
                </Link>
                <button type="button" className={quiet} onClick={() => go({ kind: "questions", category: item.category })}>
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  More in {item.category}
                </button>
              </div>
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
        aria-label={open ? "Close FAQ chat" : "Open FAQ chat"}
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
