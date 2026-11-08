import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#b9f5d0",
  "--lf-article-muted": "#6f9b84",
  "--lf-article-heading-ink": "#eafff2",
  "--lf-article-heading-font": "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  "--lf-article-accent": "#2ddf7f",
  "--lf-article-border": "#1f4d36",
  "--lf-article-code-bg": "#0a1a13",
};

const pageStyle = {
  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

export function Template5Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div
      className="min-h-screen bg-[#07110d] text-[#d7ffe8] antialiased"
      style={pageStyle}
    >
      <nav className="sticky top-0 z-40 w-full bg-[#07110d]/85 backdrop-blur-md border-b border-[#1f4d36] px-6 py-4 flex items-center justify-between">
        <Link href={portfolioUrl} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4d7a63] hover:text-[#86efac] transition-colors">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link href={portfolioUrl} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-md overflow-hidden border border-[#2ddf7f]/40">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-md bg-[#0a1a13] flex items-center justify-center text-[10px] font-bold text-[#86efac]">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-[#eafff2]">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs text-[#4d7a63] mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="text-[30px] sm:text-[42px] font-semibold tracking-tight text-[#eafff2] leading-[1.15] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          <div className="w-full h-px bg-[#1f4d36] mt-8" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-[#4d7a63] italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
