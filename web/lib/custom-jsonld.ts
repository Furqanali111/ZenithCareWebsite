/**
 * Parses the "Custom structured data" box an editor can fill on any page or post.
 * Pure. A bad value throws, which fails the build with the page named in the message.
 */
export function parseCustomJsonLd(text: string, where: string): Record<string, unknown>[] {
  const t = text.trim();
  if (!t) return [];
  let data: unknown;
  try {
    data = JSON.parse(t);
  } catch (e) {
    throw new Error(`${where}: custom structured data is not valid JSON (${(e as Error).message})`);
  }
  return (Array.isArray(data) ? data : [data]).map((n, i) => {
    if (!n || typeof n !== "object" || Array.isArray(n)) throw new Error(`${where}: custom structured data item ${i + 1} must be an object`);
    const o = n as Record<string, unknown>;
    const type = o["@type"];
    const okType = typeof type === "string" || (Array.isArray(type) && type.length > 0 && type.every((x) => typeof x === "string"));
    if (!okType && !Array.isArray(o["@graph"])) throw new Error(`${where}: custom structured data item ${i + 1} needs an "@type"`);
    return { "@context": "https://schema.org", ...o };
  });
}
