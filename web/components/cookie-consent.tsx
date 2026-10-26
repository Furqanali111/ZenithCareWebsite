"use client";

import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { ConversionTracking } from "@/components/conversion-tracking";

const KEY = "zcs-cookie-consent"; // "granted" | "denied"; absent = not asked yet
const EVENT = "zcs-consent-change";

type Consent = "granted" | "denied" | null;

// Fallback for browsers that block localStorage: lasts for this page view.
let memory: Consent = null;

function read(): Consent {
  if (memory) return memory;
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useConsent(): Consent | undefined {
  // undefined on the server / first paint, so nothing flashes or loads early.
  return useSyncExternalStore(subscribe, read, () => undefined);
}

function save(v: "granted" | "denied", gaId?: string) {
  memory = v;
  if (v === "denied") {
    // Undo an earlier "accept": stop GA now and remove its cookies.
    if (gaId) (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = true;
    for (const c of document.cookie.split(";")) {
      const name = c.split("=")[0].trim();
      if (name.startsWith("_ga")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
      }
    }
  }
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* storage blocked: choice lasts for this page view only */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Clears the choice so the banner shows again (footer "Cookie settings"). */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        memory = null;
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new Event(EVENT));
      }}
    >
      Cookie settings
    </button>
  );
}

/**
 * Loads GA4 only after the visitor accepts. "Reject" and "Accept" are the
 * same size and weight (no dark pattern). Nothing non-essential loads before
 * a choice is made.
 */
export function CookieConsent({ gaId }: { gaId?: string }) {
  const consent = useConsent();

  return (
    <>
      {consent === "granted" && gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
          <ConversionTracking />
        </>
      ) : null}

      {consent === null ? (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background p-4 shadow-lg"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-body-ink">
              We use optional analytics cookies (Google Analytics) and load our
              booking calendar (Calendly) only if you agree. Essential
              features work either way. See our{" "}
              <Link href="/cookies" className="underline underline-offset-2">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <Button variant="outline" onClick={() => save("denied", gaId)}>
                Reject optional
              </Button>
              <Button variant="outline" onClick={() => save("granted")}>
                Accept optional
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
