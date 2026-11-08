import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#334155",
  "--lf-article-muted": "#64748B",
  "--lf-article-heading-ink": "#1A1A1A",
  "--lf-article-heading-font": "system-ui, -apple-system, 'Segoe UI', sans-serif",
  "--lf-article-accent": "#1A1A1A",
  "--lf-article-border": "#E2E8F0",
  "--lf-article-code-bg": "#F8FAFC",
};

const pageStyle = {
  background: "#E8EDF4",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

export function Template11Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div
      className="min-h-screen antialiased"
      style={pageStyle}
    >
      <nav className="sticky top-0 z-40 w-full bg-[#E8EDF4]/85 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href={portfolioUrl} className="inline-flex items-center gap-2 text-[11px] font-mono text-[#94A3B8] hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link href={portfolioUrl} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-sm overflow-hidden border border-[#E2E8F0]">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-sm bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#64748B]">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-[#1A1A1A]">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-[780px] mx-auto my-8 sm:my-10 bg-white px-8 sm:px-14 py-12 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.06)]">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs font-mono text-[#94A3B8] mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-[#1A1A1A] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          <div className="w-full h-px bg-[#E2E8F0] mt-8" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-[#94A3B8] italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
