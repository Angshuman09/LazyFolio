
import { Divider, SectionLabel } from './utils';
import { normalizeBlogs } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { ArrowRight } from 'lucide-react';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';

function Blogs({profile}:{profile: ProfileData}) {
  const blogs = normalizeBlogs(profile?.blogs);
  return (
    <>
              {blogs.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionLabel>Thoughts &amp; writings</SectionLabel>
                <div className="grid gap-2">
                  {blogs.map((blog) => {
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
              </section>
            </>
          )}
    </>
  )
}

export default Blogs