
import { ArrowRight } from 'lucide-react';
import { normalizeBlogs } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, SectionHeading } from './utils';
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
        <SectionHeading>Writing</SectionHeading>
        {blogs.length === 0 ? (
          <p className="text-sm text-slate-400 italic py-6">No articles written yet.</p>
        ) : (
          <div className="space-y-px">
            {visibleBlogs.map((blog) => {
              const inner = (
                <>
                  <div className="min-w-0 flex-1">
                    {blog.title && (
                      <p className="text-[13.5px] font-medium text-slate-800 leading-snug group-hover:text-slate-900 transition-colors">
                        {blog.title}
                      </p>
                    )}
                    {blog.description && (
                      <p className="text-[12px] text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                        {blog.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-4">
                    {blog.readTime && (
                      <span className="text-[10.5px] font-mono text-slate-300">
                        {blog.readTime}
                      </span>
                    )}
                    {blog.url && (
                      <ArrowRight
                        size={11}
                        className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150"
                      />
                    )}
                  </div>
                </>
              );

              return blog.url ? (
                <Link
                  key={blog.id}
                  href={blog.url}
                  target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={blog.id}
                  className="group flex items-center justify-between py-3.5 border-b border-slate-100 last:border-b-0"
                >
                  {inner}
                </div>
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
            className="mt-4 text-[11px] font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 tracking-wide"
          >
            <span>View all {blogs.length} articles</span>
            <ArrowRight size={11} />
          </Link>
        )}
      </section>
    </>
  )
}

export default Blogs
