import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { duePosts } from "@/lib/scheduled-posts";

/**
 * Daily Vercel cron (vercel.json). A post with a "Publish on" date only goes live on the next build,
 * so this triggers a rebuild on the day a scheduled post comes due. Needs CRON_SECRET (Vercel sends it
 * as a Bearer token) and VERCEL_DEPLOY_HOOK_URL; without CRON_SECRET it answers 404.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new Response(null, { status: 404 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });

  const today = new Date().toISOString().slice(0, 10);
  const built = process.env.BUILD_DATE ?? today;
  const dir = path.join(process.cwd(), "content/posts");
  const due = duePosts(
    fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => matter(fs.readFileSync(path.join(dir, f), "utf8")).data),
    built,
    today,
  );

  if (!due.length) return Response.json({ rebuilt: false });
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return Response.json({ error: "VERCEL_DEPLOY_HOOK_URL is not set." }, { status: 500 });
  const res = await fetch(hook, { method: "POST", signal: AbortSignal.timeout(15_000) });
  return Response.json({ rebuilt: res.ok, posts: due.length }, { status: res.ok ? 200 : 502 });
}
