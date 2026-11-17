/** Posts whose "Publish on" day has come but that are missing from the live build. Pure, so the node tests can run it. */
export function duePosts<T extends { draft?: unknown; publishAt?: unknown }>(posts: T[], builtOn: string, today: string): T[] {
  return posts.filter((d) => {
    const at = d.publishAt instanceof Date ? d.publishAt.toISOString().slice(0, 10) : String(d.publishAt ?? "");
    return !d.draft && !!at && at > builtOn && at <= today;
  });
}
