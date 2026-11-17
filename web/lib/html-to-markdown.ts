/**
 * Turns the HTML of a rendered page into the plain markdown the SEO checks read, so pages written
 * in code can be analysed like posts. Regex based and good enough for this site's own markup.
 * shortcut: no real HTML parser, odd markup (unquoted attributes, nested anchors) may be misread.
 */
const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', ndash: "-", mdash: "-", hellip: "..." };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    try {
      return e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e.toLowerCase()] ?? m);
    } catch {
      return m;
    }
  });
const strip = (s: string) => s.replace(/<[^>]+>/g, "");

export function htmlToMarkdown(html: string): string {
  const main = html.match(/<main[\s>][\s\S]*<\/main>/i);
  let h = main ? main[0] : html;
  h = h
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|svg|noscript|template|nav|footer|button|iframe)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n: string, t: string) => `\n\n${"#".repeat(Number(n))} ${strip(t).replace(/\s+/g, " ").trim()}\n\n`)
    .replace(/<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, t: string) => `[${strip(t).replace(/\s+/g, " ").trim()}](${href})`)
    // A decorative image (alt="") is skipped. An image with no alt at all is what the check should flag.
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const alt = tag.match(/\salt="([^"]*)"/i);
      return alt && !alt[1].trim() ? " " : `![${alt ? alt[1] : ""}](img)`;
    })
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<tr\b[^>]*>/gi, "\n| ")
    .replace(/<\/t[dh]>/gi, " | ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|ul|ol|tr|table|header|aside|figure|figcaption|blockquote|dl|dd|dt|summary|details|form)>/gi, "\n\n")
    .replace(/<(p|div|section|article|header|aside|figure|table|blockquote)\b[^>]*>/gi, "\n\n");
  return decode(strip(h)).replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
