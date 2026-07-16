import React from 'react'
import { normalizeBlogs } from '../../shared/normalize';
import { ProfileData, TemplateThemeConfig } from '../../shared/types';
import { SectionHeading } from '../../shared/components/section-heading';
import { Divider } from '../../shared/components/divider';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Blogs = ({profile, config, iconStrokeWidth}:{profile: ProfileData, config: TemplateThemeConfig, iconStrokeWidth: number}) => {
  const blogs = normalizeBlogs(profile?.blogs);
  return (
   <>
             {blogs.length > 0 && (
            <>
              <Divider config={config} />
              <section>
                <SectionHeading config={config}>
                  Thoughts and writings
                </SectionHeading>
                <div className={config.blogListClass}>
                  {blogs.map((blog) => {
                    const content = (
                      <>
                        <div className="min-w-0 flex-1">
                          {blog.title && (
                            <p className={config.blogTitleClass}>{blog.title}</p>
                          )}
                          {blog.description && (
                            <p className={config.blogDescriptionClass}>
                              {blog.description}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2 pl-3">
                          {blog.readTime && (
                            <span className={config.blogMetaClass}>
                              {blog.readTime}
                            </span>
                          )}
                          {blog.url && (
                            <ArrowRight
                              size={12}
                              strokeWidth={iconStrokeWidth}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          )}
                        </div>
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
                        className={config.blogItemClass}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={blog.id} className={config.blogItemClass}>
                        {content}
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