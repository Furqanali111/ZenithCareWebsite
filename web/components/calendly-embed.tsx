import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Calendly's inline widget. Renders nothing when the Calendly URL env is
 * unset, same pattern as the other channel buttons on /contact, so we
 * don't ship a dead script tag before the event is published.
 *
 * The widget script scans the DOM for `.calendly-inline-widget` on load,
 * which works fine with SSR; the <Script strategy="afterInteractive">
 * tells Next to load the script after hydration.
 */
export function CalendlyEmbed({ heightPx = 720 }: { heightPx?: number }) {
  const url = site.calendlyUrl;
  if (!url) return null;

  return (
    <div>
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
    </div>
  );
}
