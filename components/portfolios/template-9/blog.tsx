import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#3f352b",
  "--lf-article-muted": "#7a6a58",
  "--lf-article-heading-ink": "#1C1814",
  "--lf-article-heading-font": "var(--font-sans-body), 'Bricolage Grotesque', system-ui, sans-serif",
  "--lf-article-accent": "#1C1814",
  "--lf-article-border": "#D8D0C5",
  "--lf-article-code-bg": "#EFE9DF",
};

const pageStyle = {
  background: "#F4F0E9",
  color: "#1C1814",
  fontFamily: "var(--font-sans-body), 'Bricolage Grotesque', system-ui, sans-serif",
};

export function Template9Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div
      className="min-h-screen antialiased font-sans-body noise-overlay relative"
      style={pageStyle}
    >
      <nav className="sticky top-0 z-40 w-full bg-[#F4F0E9]/85 backdrop-blur-md border-b border-[#D8D0C5] px-6 py-4 flex items-center justify-between">
        <Link href={portfolioUrl} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#A0907E] hover:text-[#1C1814] transition-colors">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link href={portfolioUrl} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#C8BDB0]">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#E1D8CA] flex items-center justify-center text-[10px] font-bold text-[#5C5044]">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-[#1C1814]">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-7 py-14 sm:py-20 relative z-10">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-[#B5A898] mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="text-[34px] sm:text-[44px] font-normal tracking-[-0.02em] leading-[1.05] text-[#1C1814] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          <div className="w-full h-px bg-[#D8D0C5] mt-8" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-[#A0907E] italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
