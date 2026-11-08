
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseMarkdown } from "@/lib/utils/markdown";
import { generateHTML } from "@tiptap/html";
import { htmlExtensions } from "@/components/dashboard/blogs/tiptap/extensions";
import { isTiptapJson, getWordCount } from "@/lib/utils/tiptap-content";
import { highlightCodeBlocks } from "@/lib/utils/highlight-code";
import { cacheLife, cacheTag } from "next/cache";
import { BlogRenderer } from "@/components/portfolios/blog-renderer";

async function getBlogProfile(username: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("profile", `profile-${username}`);

  return prisma.profile.findUnique({
    where: { username },
    select: { id: true, name: true, avatar: true, themeId: true, username: true },
  });
}

async function getBlogPost(profileId: string, slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("blog", `blog-${profileId}-${slug}`);

  return prisma.blog.findFirst({
    where: { profileId, slug, type: "INTERNAL", isPublished: true, isEnabled: true },
  });
}

interface PageProps {
  params: Promise<{ username: string; slug: string }> | { username: string; slug: string };
}

export default async function PublicBlogPage(props: PageProps) {
  const params = await props.params;
  const username = params?.username;
  const slug = params?.slug;

  if (!username || !slug) {
    notFound();
  }

  // 1. Fetch Profile
  const profile = await getBlogProfile(username);

  if (!profile) {
    notFound();
  }

  // 2. Fetch Blog Post (only if published)
  const blog = await getBlogPost(profile.id, slug);

  if (!blog) {
    notFound();
  }

  let previewHtml = "";
  if (blog.content) {
    if (isTiptapJson(blog.content)) {
      try {
        previewHtml = generateHTML(JSON.parse(blog.content), htmlExtensions);
      } catch {
        previewHtml = "";
      }
    } else {
      previewHtml = await parseMarkdown(blog.content);
    }
    // Syntax-highlight any raw <pre><code> blocks (tiptap JSON output).
    // Blocks already highlighted by the markdown pipeline are left as-is.
    previewHtml = await highlightCodeBlocks(previewHtml);
  }
  
  const date = blog.createdAt;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const wordCount = blog.content ? getWordCount(blog.content) : 0;

  return (
    <BlogRenderer
      themeId={profile.themeId}
      profile={{
        name: profile.name,
        avatar: profile.avatar,
        username: profile.username,
      }}
      blog={{
        title: blog.title,
        contentHtml: previewHtml,
        hasContent: Boolean(blog.content),
        formattedDate,
        wordCount,
      }}
    />
  );
}
