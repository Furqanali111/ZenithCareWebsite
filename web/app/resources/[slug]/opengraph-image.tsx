import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { getPostBySlug, getPostSlugs } from "@/content/posts";

export const alt = "Blog post, Zenith Care Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return ogImage({ title: "Post Not Found" });

  return ogImage({
    title: post.title,
    subtitle: post.description,
    badge: "RESOURCES",
  });
}
