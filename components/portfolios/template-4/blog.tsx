import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl, getMainSiteUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#19191b",
  "--lf-article-muted": "#6d6d75",
  "--lf-article-heading-ink": "#171719",
  "--lf-article-heading-font":
    "var(--font-sans), Inter, ui-sans-serif, system-ui, sans-serif",
  "--lf-article-heading-weight": "500",
  "--lf-article-accent": "#9333ea",
  "--lf-article-border": "#ececef",
  "--lf-article-code-bg": "#f4f4f5",
  "--lf-article-size": "1.125rem",
  "--lf-article-leading": "1.55",
};

const pageStyle = {
  fontFamily: "var(--font-sans), Inter, ui-sans-serif, system-ui, sans-serif",
};

export function Template4Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div
      className="min-h-screen bg-[#F9F6EE] text-[#19191b] antialiased selection:bg-purple-200 selection:text-[#111114]"
      style={pageStyle}
    >
      <nav className="sticky top-0 z-40 w-full border-b border-[#ececef] bg-[#F9F6EE] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href={portfolioUrl}
            className="inline-flex items-center gap-1.5 text-[13px] leading-[1.3] text-[#83838c] transition-colors duration-150 hover:text-[#171719]"
          >
            <ArrowLeft size={14} strokeWidth={1.6} />
            Back
          </Link>

          <Link
            href={portfolioUrl}
            className="flex items-center gap-2 transition-opacity duration-150 hover:opacity-70"
          >
            {profile.avatar ? (
              <div className="relative h-6 w-6 overflow-hidden rounded-full border border-[#ececef]">
                <Image
                  src={profile.avatar}
                  alt={profile.name || "Author"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4f4f5] text-[10px] font-medium text-[#6d6d75]">
                {profile.name?.[0] || "U"}
              </div>
            )}
            <span className="text-[13px] font-medium text-[#19191b]">
              {profile.name}
            </span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-xl px-5 pt-14 pb-16 sm:pt-16">
        <header className="mb-0">
          <div className="mb-4 flex items-center gap-4 text-[12px] text-[#919199]">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} strokeWidth={1.6} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} strokeWidth={1.6} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="m-0 text-[30px] font-medium leading-[1.12] tracking-[-0.03em] text-[#19191b] sm:text-[36px]">
            {blog.title || "Untitled Article"}
          </h1>

          <div />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text pt-8"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="py-12 text-center text-[14px] text-[#919199]">
            No content written for this post.
          </div>
        )}

        <footer className="mt-16 pt-[18px] text-[12px] text-[#9a9aa1]">
          <Link
            href={getMainSiteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-[#696971]"
          >
            Built with Lazyfolio
          </Link>
        </footer>
      </main>
    </div>
  );
}
