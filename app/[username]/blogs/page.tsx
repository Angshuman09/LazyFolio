import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, ExternalLink } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { getPortfolioUrl } from "@/lib/utils/public-url";
import { shouldOpenInNewTab } from "@/components/portfolios/shared/utils";
import { getWordCount } from "@/lib/utils/tiptap-content";
import type { Metadata } from "next";

async function getBlogsProfile(username: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("profile", `profile-${username}`);

  return prisma.profile.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      avatar: true,
      username: true,
      blogs: {
        where: {
          isEnabled: true,
          OR: [
            { type: "INTERNAL", isPublished: true },
            { type: "EXTERNAL" },
          ],
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

interface PageProps {
  params: Promise<{ username: string }> | { username: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const username = params?.username;
  if (!username) return {};

  const profile = await getBlogsProfile(username);
  const name = profile?.name || username;

  return {
    title: `Articles & Thoughts — ${name}`,
    description: `All writings and publications by ${name} on Lazyfolio.`,
  };
}

export default async function PublicBlogsPage(props: PageProps) {
  const params = await props.params;
  const username = params?.username;

  if (!username) {
    notFound();
  }

  const profile = await getBlogsProfile(username);

  if (!profile) {
    notFound();
  }

  const portfolioHomeUrl = getPortfolioUrl(profile.username);
  const blogs = profile.blogs || [];

  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) font-sans transition-colors duration-200 noise-overlay relative">
      <nav className="sticky top-0 z-40 w-full bg-(--lf-bg)/80 backdrop-blur-md border-b border-(--lf-border-alpha) px-6 py-4 flex items-center justify-between">
        <Link
          href={portfolioHomeUrl}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Profile
        </Link>

        <Link
          href={portfolioHomeUrl}
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
        >
          {profile.avatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-(--lf-border)">
              <Image
                src={profile.avatar}
                alt={profile.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-(--lf-border) flex items-center justify-center text-[10px] font-bold">
              {profile.name?.[0] || "U"}
            </div>
          )}
          <span className="text-xs font-medium text-(--lf-ink)">{profile.name}</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 sm:py-16 relative z-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-(--lf-muted) uppercase tracking-widest mb-2">
            <BookOpen size={13} />
            <span>Archive</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-medium tracking-tight text-(--lf-ink) mb-2">
            All Articles &amp; Thoughts
          </h1>
          <p className="text-sm text-(--lf-muted)">
            {blogs.length} {blogs.length === 1 ? "article" : "articles"} written and published by {profile.name || username}
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-(--lf-border) rounded-2xl p-8">
            <p className="text-sm text-(--lf-muted) italic">No articles published yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-(--lf-border) border-y border-(--lf-border)">
            {blogs.map((blog) => {
              const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              const isInternal = blog.type === "INTERNAL";
              const targetUrl = isInternal
                ? `${portfolioHomeUrl}/blogs/${blog.slug}`
                : blog.blogLink || "#";
              const isExternalTarget = shouldOpenInNewTab(targetUrl);
              const wordCount = isInternal && blog.content ? getWordCount(blog.content) : 0;
              const readTime = wordCount > 0 ? `${Math.max(1, Math.ceil(wordCount / 200))} min read` : null;

              return (
                <article key={blog.id} className="py-6 group">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-(--lf-muted) mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formattedDate}
                    </span>
                    {readTime && <span>• {readTime}</span>}
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded border border-(--lf-border) text-(--lf-muted) uppercase tracking-wider font-sans">
                      {isInternal ? "Article" : "External"}
                    </span>
                  </div>

                  <h2 className="text-lg font-medium text-(--lf-ink) group-hover:text-blue-500 transition-colors mb-2 leading-snug">
                    <Link
                      href={targetUrl}
                      target={isExternalTarget ? "_blank" : undefined}
                      rel={isExternalTarget ? "noopener noreferrer" : undefined}
                      className="inline-flex items-baseline gap-1.5"
                    >
                      <span>{blog.title || "Untitled"}</span>
                      {isInternal ? (
                        <ArrowRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all inline-block shrink-0"
                        />
                      ) : (
                        <ExternalLink
                          size={12}
                          className="opacity-60 group-hover:opacity-100 transition-opacity inline-block shrink-0"
                        />
                      )}
                    </Link>
                  </h2>

                  {blog.description && (
                    <p className="text-sm text-(--lf-muted) leading-relaxed">
                      {blog.description}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-(--lf-border-alpha) flex items-center justify-between text-xs text-(--lf-muted)">
          <Link
            href={portfolioHomeUrl}
            className="hover:text-(--lf-ink) transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={12} /> Back to portfolio
          </Link>
          <p>
            built with{" "}
            <Link href="/" className="text-(--lf-ink) hover:underline font-medium">
              lazyfolio
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
