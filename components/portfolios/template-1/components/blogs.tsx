
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PortfolioBlog } from '../../shared/types';
import { shouldOpenInNewTab } from '../../shared/utils';
import { Divider, SectionHeading } from './utils';
import { getPortfolioSectionUrl } from '@/lib/utils/public-url';

const Blogs = ({
  blogs,
  username,
}: {
  blogs: PortfolioBlog[];
  username?: string | null;
}) => {
  const visibleBlogs = blogs.slice(0, 3);

  return (
    <>
    <Divider />
    <section>
      <SectionHeading>Thoughts</SectionHeading>
      <div className="space-y-0.5">
        {visibleBlogs.map((blog) => {
          const content = (
            <>
              <div className="min-w-0 pr-4">
                {blog.title && (
                  <p className="text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                    {blog.title}
                  </p>
                )}
                {blog.description && (
                  <p className="text-[11px] text-zinc-600 leading-relaxed mt-1 line-clamp-2">
                    {blog.description}
                  </p>
                )}
              </div>
              {(blog.readTime || blog.url) && (
                <div className="flex items-center gap-2 shrink-0">
                  {blog.readTime && (
                    <span className="text-[10px] font-mono text-zinc-700">
                      {blog.readTime}
                    </span>
                  )}
                  {blog.url && (
                    <ArrowRight
                      size={10}
                      className="text-zinc-700 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all"
                    />
                  )}
                </div>
              )}
            </>
          );

          return blog.url ? (
            <Link
              key={blog.id}
              href={blog.url}
              target={
                shouldOpenInNewTab(blog.url) ? "_blank" : undefined
              }
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
            >
              {content}
            </Link>
          ) : (
            <div
              key={blog.id}
              className="group flex items-center justify-between px-3 py-3 rounded-lg border border-transparent"
            >
              {content}
            </div>
          );
        })}
      </div>

      {blogs.length > 3 && (
        <Link
          href={getPortfolioSectionUrl(username, "blogs")}
          className="inline-flex items-center gap-1.5 mt-3 ml-3 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors font-mono cursor-pointer"
        >
          <span>See all blogs ({blogs.length})</span>
          <ArrowRight size={11} />
        </Link>
      )}
    </section>
  </>
  )
}

export default Blogs