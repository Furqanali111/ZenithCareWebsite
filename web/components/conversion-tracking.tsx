"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 custom event. No-op when GA is disabled (no gtag on the page). */
export function track(event: string) {
  window.gtag?.("event", event);
}

/**
 * Fires GA4 conversion events by delegation, so no link component needs
 * editing: WhatsApp (wa.me), email (mailto:), and a Calendly booking
 * (Calendly posts `calendly.event_scheduled` from its iframe). The form
 * success event fires from ContactForm via `track`.
 *
 * Mark these as key events in GA4: whatsapp_click, email_click,
 * calendly_booking, contact_form_success.
 */
export function ConversionTracking() {
  useEffect(() => {
    function onClick(ev: MouseEvent) {
      const a = (ev.target as Element | null)?.closest?.("a[href]");
      const href = a?.getAttribute("href") ?? "";
      if (href.startsWith("mailto:")) track("email_click");
      else if (href.startsWith("https://wa.me/")) track("whatsapp_click");
    }
    function onMessage(ev: MessageEvent) {
      if (
        ev.origin === "https://calendly.com" &&
        ev.data?.event === "calendly.event_scheduled"
      ) {
        track("calendly_booking");
      }
    }
    document.addEventListener("click", onClick);
    window.addEventListener("message", onMessage);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return null;
}
