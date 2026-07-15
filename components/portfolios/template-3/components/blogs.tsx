import { ArrowRight } from 'lucide-react';
import { normalizeBlogs } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Divider, SectionHeading } from './utils';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';

const Blogs = ({profile}:{profile:ProfileData}) => {
  const blogs = normalizeBlogs(profile?.blogs);
  return (
    <>
        {blogs.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Writing</SectionHeading>
                <div className="space-y-px">
                  {blogs.map((blog) => {
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
              </section>
            </>
          )}
    </>
  )
}

export default Blogs