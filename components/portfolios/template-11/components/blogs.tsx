import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { normalizeBlogs } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { SectionLabel, MobileSectionLabel, SectionGap } from "./utils";
import { usePortfolioSection } from "../../shared/context/portfolio-section-context";

const Blogs = ({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) => {
  const sectionCtx = usePortfolioSection();
  const blogs = normalizeBlogs(profile?.blogs, profile?.username);
  const visible = showAll ? blogs : blogs.slice(0, 4);
  const blogsHref = `${basePath}/blogs`;

  if (!showAll && blogs.length === 0) return null;

  const MONO: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
  };
  const BODY: React.CSSProperties = {
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-8">
        <SectionLabel>Writing</SectionLabel>
        <div className="flex-1 min-w-0">
          <MobileSectionLabel>Writing</MobileSectionLabel>
          {blogs.length === 0 ? (
            <p className="text-[12px] italic" style={{ color: "#94A3B8", ...BODY }}>
              No articles written yet.
            </p>
          ) : (
            <div className="space-y-0">
              {visible.map((blog) => {
                const inner = (
                  <div
                    className="py-2.5 flex items-center justify-between gap-4 group"
                    style={{ borderBottom: "1px solid #F1F5F9" }}
                  >
                    <div className="flex-1 min-w-0">
                      {blog.title && (
                        <p
                          className="text-[13px] leading-snug transition-colors group-hover:text-[#1A1A1A]"
                          style={{ color: "#374151", ...BODY }}
                        >
                          {blog.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      {blog.readTime && (
                        <span className="text-[10.5px] hidden sm:block" style={{ color: "#94A3B8", ...MONO }}>
                          {blog.readTime}
                        </span>
                      )}
                      {blog.url && (
                        <ArrowRight
                          size={11}
                          className="transition-colors group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 transition-transform"
                          style={{ color: "#CBD5E1" }}
                        />
                      )}
                    </div>
                  </div>
                );

                return blog.url ? (
                  <Link
                    key={blog.id}
                    href={blog.url}
                    target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={blog.id}>{inner}</div>
                );
              })}

              {!showAll && blogs.length > 4 && (
                <Link
                  href={blogsHref}
                  onClick={(e) => {
                    if (sectionCtx?.onSectionChange) {
                      e.preventDefault();
                      sectionCtx.onSectionChange("blogs");
                    }
                  }}
                  className="block mt-3 text-[11px] cursor-pointer hover:text-[#1A1A1A] transition-colors"
                  style={{ color: "#94A3B8", ...MONO }}
                >
                  + {blogs.length - 4} more articles
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      <SectionGap />
    </>
  );
};

export default Blogs;
