import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl, getMainSiteUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#374151",
  "--lf-article-muted": "#9CA3AF",
  "--lf-article-heading-ink": "#333333",
  "--lf-article-heading-font": "var(--font-serif-display), Georgia, serif",
  "--lf-article-heading-weight": "700",
  "--lf-article-accent": "#c026d3",
  "--lf-article-border": "#F0EBE5",
  "--lf-article-code-bg": "#F5EFE8",
};

const pageStyle = {
  background: "#FFFCF9",
  color: "#0F0F0F",
  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
};

export function Template10Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <main
      className="min-h-screen antialiased"
      style={pageStyle}
    >
      <div className="mx-auto w-full max-w-160 px-6 py-6 sm:py-8">
        <nav className="mb-12 flex items-center justify-between gap-4 text-[12px] font-mono">
          <Link
            href={portfolioUrl}
            className="inline-flex items-center gap-2 text-[#9CA3AF] transition-colors hover:text-fuchsia-500"
          >
            <ArrowLeft size={13} />
            Back
          </Link>

          <Link
            href={portfolioUrl}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                width={26}
                height={26}
                unoptimized
                className="h-[26px] w-[26px] rounded-full object-cover"
                style={{ border: "2px solid #F0EBE5" }}
              />
            ) : (
              <div
                className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#F5EFE8] text-[10px] font-bold text-[#9CA3AF]"
                style={{ border: "2px solid #F0EBE5" }}
              >
                {profile.name?.[0] || "U"}
              </div>
            )}
            <span className="font-serif-display text-[14px] tracking-wide text-[#333333]">
              {profile.name}
            </span>
          </Link>
        </nav>

        <header className="mb-0">
          <div className="mb-4 flex items-center gap-4 font-mono text-[11px] text-[#C4B8AC]">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="font-serif-display text-[32px] sm:text-[38px] font-bold leading-tight tracking-wide text-[#333333] mb-4">
            {blog.title || "Untitled Article"}
          </h1>

          {blog.description && (
            <p className="font-mono text-[13px] leading-[1.6] text-[#9CA3AF] mb-6">
              {blog.description}
            </p>
          )}

          <div className="border-t border-[#F0EBE5]" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text pt-8"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="py-12 text-center text-[13px] text-[#9CA3AF]">
            No content written for this post.
          </div>
        )}

        <div
          className="mt-14 pt-5"
          style={{ borderTop: "1px solid #F0ECE8" }}
        >
          <p className="text-[11px]" style={{ color: "#C4B8AC" }}>
            built with{" "}
            <Link
              href={getMainSiteUrl()}
              className="cursor-pointer hover:text-[#1D4ED8] transition-colors"
              style={{ color: "#9CA3AF" }}
            >
              lazyfolio
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
