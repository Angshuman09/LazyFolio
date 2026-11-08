import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl, getMainSiteUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#3c3d42",
  "--lf-article-muted": "#73757e",
  "--lf-article-heading-ink": "#363842",
  "--lf-article-heading-font":
    "var(--font-sans-body), 'Bricolage Grotesque', system-ui, sans-serif",
  "--lf-article-heading-weight": "400",
  "--lf-article-accent": "#255ac2",
  "--lf-article-border": "#e6e7e9",
  "--lf-article-code-bg": "#f7f7f8",
};

const hatchStrip = {
  background:
    "repeating-linear-gradient(-45deg, transparent 0 5px, #f1f1f3 5px 6px)",
};

const dotGrid = {
  backgroundImage:
    "radial-gradient(circle, #d2d4d8 1.15px, transparent 1.3px)",
  backgroundPosition: "18px 18px",
  backgroundSize: "10px 10px",
};

export function Template8Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div className="min-h-screen bg-white text-[#111216] antialiased selection:bg-[#dce7ff] selection:text-[#111216]">
      {/* Header — mirrors the portfolio's fixed 66px bar */}
      <header className="h-[66px] border-b border-[#e6e7e9] max-[620px]:h-auto max-[620px]:min-h-[58px]">
        <div className="mx-auto flex h-full w-full max-w-[768px] items-center justify-between gap-[18px] border-x border-[#ececef] px-[18px] max-[800px]:w-[calc(100%-36px)] max-[800px]:px-3.5 max-[620px]:min-h-[58px] max-[620px]:py-3">
          <Link
            href={portfolioUrl}
            className="inline-flex items-center gap-2 text-[14px] leading-[1.3] text-[#8a8c94] capitalize transition-colors duration-150 hover:text-[#15161a]"
          >
            <ArrowLeft size={14} strokeWidth={1.6} />
            Back
          </Link>

          <Link
            href={portfolioUrl}
            className="flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-70"
            aria-label={profile.name ? `${profile.name}'s portfolio` : "Portfolio"}
          >
            <span className="hidden text-[13px] text-[#73757e] sm:inline">
              {profile.name}
            </span>
            {profile.avatar ? (
              <div className="h-8 w-8 overflow-hidden rounded-[10px] border border-[#dedfe3] bg-[#f7f8f8]">
                <Image
                  src={profile.avatar}
                  alt={profile.name || "Author"}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#dedfe3] font-sans-body text-[12px] tracking-[-0.06em] text-[#12232c]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #d2d7d9 1px, transparent 1.15px)",
                  backgroundSize: "7px 7px",
                }}
                aria-hidden="true"
              >
                {profile.name?.[0] || "U"}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* Dot-grid band — same radius as the hero's dot background */}
      <div
        className="h-[90px] border-b border-[#e6e7e9] max-[620px]:h-[56px]"
        style={dotGrid}
        aria-hidden="true"
      />

      <main className="mx-auto w-full max-w-[768px] border-x border-[#ececef] max-[800px]:w-[calc(100%-36px)]">
        <div className="px-[27px] pt-12 pb-9 max-[620px]:px-[18px] max-[620px]:pt-9">
          <div className="mb-4 flex items-center gap-4 font-mono text-[10px] leading-[1.5] text-[#9a9ca5]">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} strokeWidth={1.6} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={11} strokeWidth={1.6} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="font-sans-body m-0 text-[30px] font-normal leading-[1.02] tracking-[-0.055em] text-[#22242a] break-words max-[620px]:text-[27px] sm:text-[38px]">
            {blog.title || "Untitled Article"}
          </h1>

          {blog.description && (
            <p className="mt-2.5 text-[15px] leading-[1.5] text-[#858791] max-[620px]:text-[13px]">
              {blog.description}
            </p>
          )}
        </div>

        {/* Hatched section divider */}
        <div
          className="h-[26px] border-b border-[#e6e7e9]"
          style={hatchStrip}
          aria-hidden="true"
        />

        {blog.hasContent ? (
          <article
            className="lf-article select-text px-[27px] py-9 max-[620px]:px-[18px] max-[620px]:py-7"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="px-[27px] py-12 text-[14px] text-[#9698a0] max-[620px]:px-[18px]">
            No content written for this post.
          </div>
        )}

        <div
          className="h-[26px] border-b border-[#e6e7e9]"
          style={hatchStrip}
          aria-hidden="true"
        />

        <footer className="px-[27px] pb-[30px] pt-5 font-mono text-[10px] leading-[1.5] text-[#9a9ca4] max-[620px]:px-[18px] max-[620px]:pb-7">
          <Link
            href={getMainSiteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-[#4e6fae]"
          >
            Built with Lazyfolio
          </Link>
        </footer>
      </main>
    </div>
  );
}
