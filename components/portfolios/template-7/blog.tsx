import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#3f2a26",
  "--lf-article-muted": "#6b4a43",
  "--lf-article-heading-ink": "#241513",
  "--lf-article-accent": "#dc2626",
  "--lf-article-border": "#241513",
  "--lf-article-code-bg": "#fef9c3",
};

const pageStyle = {
  fontFamily: "'DM Sans', var(--font-sans), system-ui, sans-serif",
};

export function Template7Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div
      className="min-h-screen bg-[#fff7ed] text-[#241513] antialiased"
      style={pageStyle}
    >
      <nav className="sticky top-0 z-40 w-full bg-[#fff7ed] border-b-2 border-[#241513] px-6 py-4 flex items-center justify-between">
        <Link href={portfolioUrl} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#241513] hover:text-[#ef4444] transition-colors">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link href={portfolioUrl} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-md overflow-hidden border-2 border-[#241513]">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-md border-2 border-[#241513] bg-[#fecaca] flex items-center justify-center text-[10px] font-black text-[#241513]">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-bold uppercase tracking-wide text-[#241513]">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-12 sm:py-16">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.12em] text-[#a16207] mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="text-[34px] sm:text-[44px] font-black leading-[0.98] text-[#241513] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          {blog.description && (
            <p className="text-[1.05rem] font-semibold text-[#5c2d25] leading-relaxed mb-6">{blog.description}</p>
          )}

          <div className="w-full h-[2px] bg-[#241513] mt-8" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text rounded-lg border-2 border-[#241513] bg-white p-6 sm:p-8 shadow-[6px_6px_0_#241513]"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-[#6b4a43] italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
