import { Divider, SectionLabel } from './utils';
import { normalizeBlogs } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { ArrowRight } from 'lucide-react';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';
import { usePortfolioSection } from '../../shared/context/portfolio-section-context';

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
  const visibleBlogs = showAll ? blogs : blogs.slice(0, 3);
  const blogsHref = `${basePath}/blogs`;

  if (!showAll && blogs.length === 0) return null;

  return (
    <>
      <Divider />
      <section>
        <SectionLabel>Thoughts &amp; writings</SectionLabel>
        {blogs.length === 0 ? (
          <p className="text-xs text-[#7A9585] italic py-6">No articles written yet.</p>
        ) : (
          <div className="grid gap-2">
            {visibleBlogs.map((blog) => {
              const rowClass =
                "flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] px-4 py-[14px] no-underline text-inherit transition-colors duration-150 hover:bg-[#E3EDE7]";

              const inner = (
                <>
                  <div className="min-w-0 flex-1">
                    {blog.title && (
                      <p className="text-sm font-semibold text-[#1A3D2B] m-0">
                        {blog.title}
                      </p>
                    )}
                    {blog.description && (
                      <p className="mt-[3px] mb-0 text-xs leading-[1.65] text-[#3D5247] line-clamp-2">
                        {blog.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                    {blog.readTime && (
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#7A9585]">
                        {blog.readTime}
                      </span>
                    )}
                    {blog.url && <ArrowRight size={12} strokeWidth={1.8} color="#C4622D" />}
                  </div>
                </>
              );

              return blog.url ? (
                <Link
                  key={blog.id}
                  href={blog.url}
                  target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={rowClass}
                >
                  {inner}
                </Link>
              ) : (
                <div key={blog.id} className={rowClass}>{inner}</div>
              );
            })}
          </div>
        )}

        {!showAll && blogs.length > 3 && (
          <Link
            href={blogsHref}
            onClick={(e) => {
              if (sectionCtx?.onSectionChange) {
                e.preventDefault();
                sectionCtx.onSectionChange("blogs");
              }
            }}
            className="mt-[14px] inline-flex items-center gap-[5px] text-xs font-bold text-[#C4622D] hover:text-[#1A3D2B] transition-colors duration-150"
          >
            <span>View all {blogs.length} articles</span>
            <ArrowRight size={11} strokeWidth={2.2} />
          </Link>
        )}
      </section>
    </>
  )
}

export default Blogs
