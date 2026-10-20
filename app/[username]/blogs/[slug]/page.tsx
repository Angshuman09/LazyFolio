
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { parseMarkdown } from "@/lib/utils/markdown";
import { generateHTML } from "@tiptap/html";
import { htmlExtensions } from "@/components/dashboard/blogs/tiptap/extensions";
import { isTiptapJson, getWordCount } from "@/lib/utils/tiptap-content";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import { getBlogTheme } from "@/components/portfolios/blog-theme";

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
  }
  
  const date = blog.createdAt;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Match the article page to the portfolio's chosen template.
  const theme = getBlogTheme(profile.themeId);

  return (
    <div
      className={`${theme.pageClass}${theme.noise ? " noise-overlay relative" : ""}`}
      style={theme.pageStyle}
    >
      <nav className={theme.navClass}>
        <Link
          href={getPortfolioUrl(profile.username)}
          className={theme.backLinkClass}
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link href={getPortfolioUrl(profile.username)} className={theme.authorClass}>
          {profile.avatar ? (
            <div className={theme.avatarWrapClass}>
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={theme.avatarFallbackClass}>
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className={theme.authorNameClass}>{profile.name}</span>
        </Link>
      </nav>

      <main className={theme.containerClass}>
        <header className="mb-10 text-left">
          <div className={theme.metaClass}>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.content ? `${getWordCount(blog.content)} words` : "0 words"}
            </span>
          </div>

          {/* Title */}
          <h1 className={theme.titleClass}>
            {blog.title || "Untitled Article"}
          </h1>

          {/* Description */}
          {blog.description && (
            <p className={theme.descriptionClass}>{blog.description}</p>
          )}

          <div className={theme.dividerClass} />
        </header>

        {blog.content ? (
          <article
            className={`lf-article select-text ${theme.articleClass}`}
            style={theme.articleStyle}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <div className={theme.emptyClass}>
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
