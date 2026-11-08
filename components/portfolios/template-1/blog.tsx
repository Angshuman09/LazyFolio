import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#292524",
  "--lf-article-muted": "#78716c",
  "--lf-article-heading-ink": "#1c1917",
  "--lf-article-accent": "#1c1917",
  "--lf-article-border": "#e7e5e4",
  "--lf-article-code-bg": "#f5f5f4",
};

export function Template1Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-stone-700 antialiased">
      <nav className="sticky top-0 z-40 w-full bg-[#fbfbfb]/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <Link
          href={portfolioUrl}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link
          href={portfolioUrl}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-stone-200">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-600">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-stone-900">
            {profile.name}
          </span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-14 sm:py-20">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs text-stone-400 font-mono mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-[1.15] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          {blog.description && (
            <p className="text-[1.05rem] text-stone-500 leading-relaxed mb-6 italic">
              {blog.description}
            </p>
          )}

          <div className="w-full h-px bg-stone-200 mt-8" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-stone-400 italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
