import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import type { BlogArticleStyle, BlogPageProps } from "../shared/types";

const articleStyle: BlogArticleStyle = {
  "--lf-article-ink": "#33584a",
  "--lf-article-muted": "#6d8a79",
  "--lf-article-heading-ink": "#1A3D2B",
  "--lf-article-accent": "#166534",
  "--lf-article-border": "#D5E5DA",
  "--lf-article-code-bg": "#f2f8f1",
};

const pageStyle = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

export function Template6Blog({ profile, blog }: BlogPageProps) {
  const portfolioUrl = getPortfolioUrl(profile.username);

  return (
    <div
      className="min-h-screen bg-[#FDF6EC] text-[#1A3D2B] antialiased"
      style={pageStyle}
    >
      <nav className="sticky top-0 z-40 w-full bg-[#FDF6EC]/85 backdrop-blur-md border-b border-[#D5E5DA] px-6 py-4 flex items-center justify-between">
        <Link href={portfolioUrl} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A9585] hover:text-[#1A3D2B] transition-colors">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link href={portfolioUrl} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#D5E5DA]">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#DCE9E0] flex items-center justify-center text-[10px] font-bold text-[#5b7a68]">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-[#1A3D2B]">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-14 sm:py-20">
        <header className="mb-10 text-left">
          <div className="flex items-center gap-4 text-xs text-[#7A9585] mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {blog.wordCount} words
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A3D2B] leading-[1.15] mb-5">
            {blog.title || "Untitled Article"}
          </h1>

          {blog.description && (
            <p className="text-[1.05rem] text-[#5b7a68] leading-relaxed mb-6 italic">{blog.description}</p>
          )}

          <div className="w-full h-px bg-[#D5E5DA] mt-8" />
        </header>

        {blog.hasContent ? (
          <article
            className="lf-article select-text"
            style={articleStyle}
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
        ) : (
          <div className="text-center text-[#7A9585] italic text-sm py-12">
            No content written for this post.
          </div>
        )}
      </main>
    </div>
  );
}
