import Link from 'next/link';
import { normalizeBlogs } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, SectionHeading } from './utils';
import { shouldOpenInNewTab } from '../../shared/utils';
import { ArrowRight } from 'lucide-react';
import { getPortfolioSectionUrl } from '@/lib/utils/public-url';

const Blogs = ({profile}:{profile: ProfileData}) => {
  const blogs = normalizeBlogs(profile?.blogs, profile?.username);
  const visibleBlogs = blogs.slice(0, 3);
  return (
    <>
         {blogs.length > 0 && (
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
                            <p className="text-[13px] text-stone-600 group-hover:text-stone-900 transition-colors leading-snug">
                              {blog.title}
                            </p>
                          )}
                          {blog.description && (
                            <p className="text-[11px] text-stone-400 leading-relaxed mt-1 line-clamp-2">
                              {blog.description}
                            </p>
                          )}
                        </div>
                        {(blog.readTime || blog.url) && (
                          <div className="flex items-center gap-2 shrink-0">
                            {blog.readTime && (
                              <span className="text-[10px] font-mono text-stone-400">
                                {blog.readTime}
                              </span>
                            )}
                            {blog.url && (
                              <ArrowRight
                                size={10}
                                className="text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all"
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
                        target={shouldOpenInNewTab(blog.url) ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all duration-150"
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
                    href={getPortfolioSectionUrl(profile?.username, "blogs")}
                    className="inline-flex items-center gap-1.5 mt-3 ml-3 text-[11px] text-stone-500 hover:text-stone-700 transition-colors font-mono cursor-pointer"
                  >
                    <span>See all blogs ({blogs.length})</span>
                    <ArrowRight size={11} />
                  </Link>
                )}
              </section>
            </>
          )}
    </>
  )
}

export default Blogs
