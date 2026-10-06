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

  return (
    <>
      <Divider />
      <section>
        <SectionHeading>Thoughts</SectionHeading>
        {blogs.length === 0 ? (
          <p className="text-[13px] italic" style={{ color: "#9A8C7C" }}>
            No articles published yet.
          </p>
        ) : (
          <div
            className="divide-y"
          >
            {visible.map((blog) => {
              const inner = (
                <div className="py-4 flex items-baseline justify-between gap-4 group">
                  <div className="flex-1 min-w-0 pr-4">
                    {blog.title && (
                      <p
                        className="text-[14px] font-medium leading-snug transition-colors group-hover:text-[#184E42]"
                        style={{ color: "#1C1814" }}
                      >
                        {blog.title}
                      </p>
                    )}
                    {blog.description && (
                      <p
                        className="text-[12.5px] mt-1 leading-relaxed line-clamp-1"
                        style={{ color: "#7A6C5D" }}
                      >
                        {blog.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {blog.readTime && (
                      <span
                        className="text-[11px] font-mono hidden sm:inline"
                        style={{ color: "#A0907E" }}
                      >
                        {blog.readTime}
                      </span>
                    )}
                    <span
                      className="text-[11px] font-mono inline-flex items-center gap-1 transition-colors group-hover:text-[#184E42]"
                      style={{ color: "#8C7B6A" }}
                    >
                      read
                      <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
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
                  className="block cursor-pointer"
                  style={{ borderColor: "#E4DCD2" }}
                >
                  {inner}
                </Link>
              ) : (
                <div key={blog.id} style={{ borderColor: "#E4DCD2" }}>
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
            className="inline-flex items-center gap-1.5 mt-6 text-[11px] font-mono transition-colors cursor-pointer hover:underline"
            style={{ color: "#184E42" }}
          >
            <span>All articles ({blogs.length})</span>
            <ArrowRight size={11} />
          </Link>
        )}
      </section>
    </>
  );
};

export default Blogs;
