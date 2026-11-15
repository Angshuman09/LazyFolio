import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#d4d4d4",
  "--lf-article-muted": "#a3a3a3",
  "--lf-article-heading-ink": "#f5f5f5",
  "--lf-article-accent": "#ffffff",
  "--lf-article-border": "#262626",
  "--lf-article-code-bg": "#171717",
};

export function Template3Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-400 antialiased selection:bg-neutral-800 selection:text-white">
      <nav className="sticky top-0 z-40 w-full bg-[#0a0a0a]/85 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4 flex items-center justify-between">
        <Link
          href={portfolioUrl}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link
          href={portfolioUrl}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-neutral-700">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400 border border-neutral-700">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-neutral-200">{profile.name}</span>
        </Link>
      </nav>

      <main className="mx-auto px-6 py-14 sm:py-20" style={{ maxWidth: 740 }}>
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-[-0.01rem] text-neutral-100 leading-[1.2] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          <div className="w-12 h-px bg-neutral-700 mt-6" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-neutral-500 italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
