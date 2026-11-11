import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

// Without the GitHub App secrets (see WebSiteDoc/Project/16-keystatic-cms.md) the
// handler would throw at build time and break every deploy. Answer 404 instead.
const enabled =
  process.env.NODE_ENV === "development" ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET,
  );
const handler = enabled ? makeRouteHandler({ config }) : null;
const notFound = () => new Response("Not found", { status: 404 });

export const GET = handler?.GET ?? notFound;
export const POST = handler?.POST ?? notFound;
