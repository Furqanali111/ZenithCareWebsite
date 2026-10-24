import { services } from "./services";

/**
 * Per-service WhatsApp message and email subject, keyed by slug. Built on the
 * server and passed to the small client components that need it, so the whole
 * service registry (long page copy) is not shipped in the client JavaScript.
 */
export type ServiceContacts = Record<string, { whatsapp: string; subject: string }>;

export function getServiceContacts(): ServiceContacts {
  return Object.fromEntries(
    services.map((s) => [s.slug, { whatsapp: s.whatsappMessage, subject: s.emailSubject }]),
  );
}
