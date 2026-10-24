"use client";

import { usePathname } from "next/navigation";
import type { ServiceContacts } from "@/lib/service-contact";
import { mailtoHref, site } from "@/lib/site";

/**
 * Footer email link that picks the per-service inquiry subject when the viewer
 * is on a /services/<slug> page, so the mailto subject is not always "CCM".
 */
export function ContactEmailLink({
  className,
  contacts,
}: {
  className?: string;
  contacts: ServiceContacts;
}) {
  const pathname = usePathname();
  const slug = pathname?.startsWith("/services/")
    ? pathname.split("/")[2]
    : undefined;
  const subject = (slug && contacts[slug]?.subject) || "Website Inquiry";
  return (
    <a href={mailtoHref(subject)} className={className}>
      {site.email}
    </a>
  );
}
