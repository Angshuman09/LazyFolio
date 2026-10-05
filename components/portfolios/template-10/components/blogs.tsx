import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { normalizeBlogs } from "../../shared/normalize";
import { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Divider, SectionHeading } from "./utils";
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

  const seeAll = !showAll && blogs.length > 4 && (
    <Link
      href={blogsHref}
      onClick={(e) => {
        if (sectionCtx?.onSectionChange) {
          e.preventDefault();
          sectionCtx.onSectionChange("blogs");
        }
      }}
      className="text-[12px] cursor-pointer transition-colors hover:text-[#1e3a8a]"
      style={{ color: "#1D4ED8" }}
    >
      See all →
    </Link>
  );

  return (
    <>
      <Divider />
      <section>
        <SectionHeading action={seeAll}>Writing</SectionHeading>
        {blogs.length === 0 ? (
          <p className="text-[13px]" style={{ color: "#9CA3AF" }}>
            No articles written yet.
          </p>
        ) : (
          <div className="space-y-0">
            {visible.map((blog) => {
              const inner = (
                <div
                  className="py-3.5 flex items-center justify-between gap-4 group"
                  style={{ borderBottom: "1px solid #F0EBE5" }}
                >
                  <div className="flex-1 min-w-0">
                    {blog.title && (
                      <p
                        className="text-[13.5px] font-medium leading-snug transition-colors group-hover:text-[#1D4ED8]"
                        style={{ color: "#0F0F0F" }}
                      >
                        {blog.title}
                      </p>
                    )}
                    {blog.description && (
                      <p
                        className="text-[12px] mt-0.5 line-clamp-1 font-mono"
                        style={{ color: "#9CA3AF" }}
                      >
                        {blog.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {blog.readTime && (
                      <span
                        className="text-[11px] font-mono hidden sm:block"
                        style={{ color: "#C4B8AC" }}
                      >
                        {blog.readTime}
                      </span>
                    )}
                    <span
                      className="text-[11px] font-mono transition-colors group-hover:text-[#1D4ED8] flex items-center gap-0.5"
                      style={{ color: "#9CA3AF" }}
                    >
                      Read
                      <ArrowRight
                        size={10}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
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
          </div>
        )}
      </section>
    </>
  );
};

export default Blogs;
