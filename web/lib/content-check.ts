/**
 * Decides whether one changed file counts as plain content, so a branch can go live without review.
 * MDX can run code when the site is built, so articles are held to a strict whitelist.
 */
export type ChangedFile = { path: string; status: string; mode: string; text?: string };

const ROOTS = ["web/content/", "web/public/resources/", "web/public/social/"];
const IMAGES = [".webp", ".jpg", ".jpeg", ".png", ".avif"];
const STATUSES = ["A", "M", "D", "R", "T"];
// gray-matter and MDX both treat anything outside these as code or markup, so only these tags pass.
const OK_TAG = /^<\/?(?:Callout|BookCall|Toc)(?=[ \t\r\n/>])/;

// File names are hostile input and end up in one-line-per-reason output.
const clean = (s: string) => s.replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, "?");

function mdxProblem(text: string): string | null {
  if (!/^---\r?(\n|$)/.test(text)) return "must start with a line that is exactly three dashes (---)";
  // Same rule gray-matter uses: the first line starting with --- closes the front matter.
  const close = text.indexOf("\n---", 3);
  if (close < 0) return "has a top section (between two --- lines) that is never closed";
  const body = text.slice(close + 4);
  if (/(^|[^\\])(\\\\)*\{/.test(body)) return "contains a curly bracket { in the text. Remove it, or put a backslash before it";
  if (/^[ \t]*(import|export)\b/m.test(body)) return "contains a line starting with the word import or export. Remove that line";
  for (let i = body.indexOf("<"); i >= 0; i = body.indexOf("<", i + 1)) {
    let slashes = 0;
    while (body[i - 1 - slashes] === "\\") slashes++;
    if (slashes % 2 || i + 1 >= body.length || /[ \t\r\n]/.test(body[i + 1])) continue;
    if (!OK_TAG.test(body.slice(i, i + 12))) return "contains a < sign that starts something other than a Callout, BookCall or Toc box. Remove it, or put a backslash before it";
  }
  return null;
}

/** Returns why this file cannot be published without review, or null when it is fine. */
export function checkFile(f: ChangedFile): string | null {
  const name = clean(f.path);
  const parts = f.path.split("/");
  const ext = /\.[^./]+$/.exec(f.path)?.[0] ?? "";
  const textual = ext === ".mdx" || ext === ".json";
  const inRoot = ROOTS.some((r) => f.path.startsWith(r)) && !parts.some((p) => p === "" || p === "." || p === "..") && !/[\\\p{Cc}]/u.test(f.path);
  const allowed = inRoot && (textual ? f.path.startsWith("web/content/") : IMAGES.includes(ext));
  if (!allowed) return `${name}: this file is not an article, content data or image, so it needs a developer to look at it. Please remove it from your changes.`;
  if (!STATUSES.includes(f.status)) return `${name}: this kind of change is not recognised. Please ask a developer to look at it.`;
  if (f.status === "D") return null;
  if (f.mode !== "100644") return `${name}: this is a link or special file, not a normal file. Please add it again as a normal file.`;
  if (!textual) return null;
  if (f.text === undefined) return `${name}: this file could not be read. Please add it again.`;
  if (ext === ".json") {
    try {
      JSON.parse(f.text);
    } catch {
      return `${name}: this file is not valid JSON, so the site could not read it. Please fix the typing mistake.`;
    }
    return null;
  }
  const problem = mdxProblem(f.text);
  return problem ? `${name}: ${problem}.` : null;
}
