import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#d4d4d8",
  "--lf-article-muted": "#a1a1aa",
  "--lf-article-heading-ink": "#fafafa",
  "--lf-article-accent": "#e4e4e7",
  "--lf-article-border": "#27272a",
  "--lf-article-code-bg": "#18181b",
};

export function Template2Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div
      className="min-h-screen bg-[#0e0e0e] text-zinc-300 antialiased"
    >
      <nav className="sticky top-0 z-40 w-full bg-[#0e0e0e]/85 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href={portfolioUrl} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-300 transition-colors">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link href={portfolioUrl} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-zinc-700">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-zinc-100">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-14 sm:py-20">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs text-zinc-600 font-mono mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100 leading-[1.15] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          {blog.description && (
            <p className="text-[1.05rem] text-zinc-500 leading-relaxed mb-6 italic">{blog.description}</p>
          )}

          <div className="w-full h-px bg-zinc-800 mt-8" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-zinc-600 italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
