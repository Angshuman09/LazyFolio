import { ArrowRight } from "lucide-react";
import { normalizeBlogs } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { SectionHeading } from "./utils";
import { shouldOpenInNewTab } from "../../shared/utils";
import Link from "next/link";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";

interface BlogsProps {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}

export default function Blogs({
  profile,
  showAll = false,
  basePath = "",
}: BlogsProps) {
  const sectionCtx = usePortfolioSection();
  const blogs = normalizeBlogs(profile?.blogs, profile?.username);
  const visibleBlogs = showAll ? blogs : blogs.slice(0, 4);
  const blogsHref = `${basePath}/blogs`;

  if (!showAll && blogs.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20">
      <SectionHeading>Writing</SectionHeading>

      {blogs.length === 0 ? (
        <p className="text-sm text-neutral-500 italic py-4">No articles written yet.</p>
      ) : (
        <div className="-mx-4 space-y-1">
          {visibleBlogs.map((blog) => {
            const inner = (
              <div className="rounded-xl px-4 py-3 leading-relaxed transition-colors hover:bg-neutral-800/40">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="block text-[15px] sm:text-[16px] text-neutral-100 group-hover:text-white transition-colors">
                    {blog.title}
                  </span>
                  {blog.readTime && (
                    <span className="text-[12px] font-mono text-neutral-500 shrink-0">
                      {blog.readTime}
                    </span>
                  )}
                </div>
                {blog.description && (
                  <span className="block text-[14px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {blog.description}
                  </span>
                )}
              </div>
            );

            return blog.url ? (
              <Link
                key={blog.id}
                href={blog.url}
                target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group block"
              >
                {inner}
              </Link>
            ) : (
              <div key={blog.id} className="group block">
                {inner}
              </div>
            );
          })}
        </div>
      )}

      {!showAll && blogs.length > 4 && (
        <Link
          href={blogsHref}
          onClick={(e) => {
            if (sectionCtx?.onSectionChange) {
              e.preventDefault();
              sectionCtx.onSectionChange("blogs");
            }
          }}
          className="mt-4 text-[13px] text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 px-4 tracking-wide"
        >
          <span>View all {blogs.length} articles</span>
          <ArrowRight size={12} />
        </Link>
      )}
    </section>
  );
}
