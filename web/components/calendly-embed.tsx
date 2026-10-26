"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { site } from "@/lib/site";
import { useConsent } from "@/components/cookie-consent";

/**
 * Calendly's inline widget. Renders nothing when the Calendly URL env is
 * unset, same pattern as the other channel buttons on /contact, so we
 * don't ship a dead script tag before the event is published.
 *
 * The widget (and its third-party cookies and ~200 KB of script) loads only
 * when the visitor scrolls near it, not on first paint. That keeps /contact
 * fast and sets no third-party cookies for visitors who never reach the
 * calendar. The widget script scans the DOM for `.calendly-inline-widget`
 * on load, so the div is rendered before the script is added.
 */
export function CalendlyEmbed({ heightPx = 720 }: { heightPx?: number }) {
  const url = site.calendlyUrl;
  const holder = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  // Calendly sets third-party cookies, so the widget loads only after consent.
  const consent = useConsent();

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!url) return null;

  return (
    <div ref={holder}>
      {near && consent === "granted" ? (
        <>
          <div
            className="calendly-inline-widget w-full rounded-xl overflow-hidden border border-border"
            data-url={url}
            // No fixed min-width: the widget is fluid and fills its container.
            // A hard 320px min overflowed the padded column on a 320px viewport.
            style={{ height: `${heightPx}px` }}
          />
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="afterInteractive"
          />
        </>
      ) : (
        <div
          className="flex w-full items-center justify-center rounded-xl border border-border text-sm text-muted-foreground"
          style={{ height: `${heightPx}px` }}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-brand-ink"
          >
            Open the booking calendar
          </a>
        </div>
      )}
    </div>
  );
}
