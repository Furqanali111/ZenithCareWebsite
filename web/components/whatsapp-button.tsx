import { MessageCircle } from "lucide-react";
import { whatsappHref, site } from "@/lib/site";

/**
 * Floating WhatsApp CTA, visible on every page.
 * Hidden if no WhatsApp number is configured so we don't surface a dead link.
 */
export function WhatsAppButton() {
  if (!site.whatsappNumber) return null;

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[color:var(--color-brand-900)] text-white shadow-lg transition hover:bg-[color:var(--color-brand-700)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-brand-700)]"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}
