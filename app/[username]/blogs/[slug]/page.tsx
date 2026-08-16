
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { parseMarkdown } from "@/lib/utils/markdown";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";

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

  const previewHtml = await parseMarkdown(blog.content || "");
  
  const date = blog.createdAt;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) font-sans transition-colors duration-200 noise-overlay relative">

      <nav className="sticky top-0 z-40 w-full bg-(--lf-bg)/80 backdrop-blur-md border-b border-(--lf-border-alpha) px-6 py-4 flex items-center justify-between">
        <Link
          href={`/${profile.username}`}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link
          href={`/${profile.username}`}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-(--lf-border)">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-(--lf-border) flex items-center justify-center text-[10px] font-bold">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-(--lf-ink)">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-14 sm:py-20 relative z-10">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs text-(--lf-muted) font-mono mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.content ? `${blog.content.split(/\s+/).filter(Boolean).length} words` : "0 words"}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif-display text-4xl sm:text-5xl font-medium tracking-tight text-(--lf-ink) leading-[1.1] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          {/* Description */}
          {blog.description && (
            <p className="text-[1.05rem] text-(--lf-muted) leading-relaxed mb-6 font-sans italic opacity-85">
              {blog.description}
            </p>
          )}

          <div className="w-full h-px bg-(--lf-border) mt-8" />
        </header>

        {blog.content ? (
          <article
            className="prose dark:prose-invert font-sans leading-relaxed select-text"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <div className="text-center text-(--lf-muted) italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
