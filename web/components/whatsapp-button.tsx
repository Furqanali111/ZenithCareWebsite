"use client";

import { usePathname } from "next/navigation";
import { whatsappHref, site } from "@/lib/site";
import type { ServiceContacts } from "@/lib/service-contact";

/**
 * Floating WhatsApp CTA, visible on every page. On a /services/<slug> page it
 * prefills that service's message instead of the generic CCM one.
 * Hidden if no WhatsApp number is configured so we don't surface a dead link.
 */
export function WhatsAppButton({ contacts }: { contacts: ServiceContacts }) {
  const pathname = usePathname();
  if (!site.whatsappNumber) return null;

  const slug = pathname?.startsWith("/services/")
    ? pathname.split("/")[2]
    : undefined;
  const message = slug ? contacts[slug]?.whatsapp : undefined;
  const href = message ? whatsappHref(message) : whatsappHref();

  return (
    <aside aria-label="WhatsApp contact">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lg transition hover:bg-[#0e7469] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E]"
      >
        <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.04c0-5.21 4.24-9.45 9.46-9.45 2.52 0 4.9.99 6.68 2.77a9.4 9.4 0 0 1 2.76 6.69c0 5.21-4.24 9.46-9.43 9.46zM20.52 3.45A11.35 11.35 0 0 0 12.04 0C5.77 0 .67 5.1.67 11.37c0 2 .52 3.96 1.52 5.69L.57 23.5l6.58-1.73a11.36 11.36 0 0 0 5.43 1.38h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.9-3.34-8.05z" />
        </svg>
      </a>
    </aside>
  );
}
