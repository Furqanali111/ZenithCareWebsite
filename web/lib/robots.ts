/**
 * Validates and finishes the robots.txt text edited in /keystatic ("Robots.txt").
 * Pure, so the node tests can run it. A bad text throws, which fails the build instead of shipping.
 * Doc: WebSiteDoc/Project/16g-cms-seo-dashboard.md
 */

// Site rule: never block AI crawlers (WebSiteDoc/Project/12-claude-requirements.md section 3.6).
const AI_BOTS = ["gptbot", "claudebot", "perplexitybot", "google-extended", "ccbot", "anthropic-ai", "claude-web", "oai-searchbot", "chatgpt-user"];
const ALLOWED = new Set(["user-agent", "allow", "disallow", "sitemap", "crawl-delay"]);
// The editor and its API must never be crawled.
const REQUIRED_DISALLOW = ["/keystatic", "/api/keystatic"];

export function buildRobots(text: string, base: string): string {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const fail = (msg: string): never => {
    throw new Error(`content/robots.json: ${msg}`);
  };

  const disallowed = new Set<string>();
  let agents: string[] = [];
  let lastWasAgent = false;
  let hasSitemap = false;

  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf(":");
    const key = (i < 0 ? line : line.slice(0, i)).trim().toLowerCase();
    const value = i < 0 ? "" : line.slice(i + 1).trim();
    if (!ALLOWED.has(key)) fail(`"${line}" is not allowed. Use User-agent, Allow, Disallow, Sitemap or Crawl-delay.`);

    if (key === "user-agent") {
      if (!value) fail("User-agent needs a name.");
      agents = lastWasAgent ? [...agents, value.toLowerCase()] : [value.toLowerCase()];
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === "sitemap") {
      if (!/^https:\/\/\S+$/.test(value)) fail(`Sitemap must be a full https:// address, got "${value}".`);
      hasSitemap = true;
    } else if (key === "disallow" || key === "allow") {
      if (!agents.length) fail(`"${line}" comes before any User-agent line.`);
      if (key === "disallow" && value) {
        if (value === "/") fail(`"Disallow: /" would block the whole site from search engines.`);
        if (agents.some((a) => AI_BOTS.some((b) => a.includes(b)))) {
          fail(`"${line}" blocks an AI crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot). The site must stay open to them.`);
        }
        disallowed.add(value);
      }
    }
  }

  for (const p of REQUIRED_DISALLOW) if (!disallowed.has(p)) fail(`"Disallow: ${p}" must stay in the file.`);
  const out = lines.filter((l, i) => l || (i > 0 && lines[i - 1])).join("\n").trim();
  return `${out}\n${hasSitemap ? "" : `\nSitemap: ${base}/sitemap.xml\n`}`;
}
