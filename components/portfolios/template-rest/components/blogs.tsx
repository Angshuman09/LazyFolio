import React from 'react'
import { normalizeBlogs } from '../../shared/normalize';
import { ProfileData, TemplateThemeConfig } from '../../shared/types';
import { SectionHeading } from '../../shared/components/section-heading';
import { Divider } from '../../shared/components/divider';
import { shouldOpenInNewTab } from '../../shared/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePortfolioSection } from '../../shared/context/portfolio-section-context';

const Blogs = ({
  profile,
  config,
  iconStrokeWidth,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  config: TemplateThemeConfig;
  iconStrokeWidth: number;
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
     <Divider config={config} />
     <section>
       <SectionHeading config={config}>
         Thoughts and writings
       </SectionHeading>
       {blogs.length === 0 ? (
         <p className="text-sm italic py-6 opacity-60">No articles written yet.</p>
       ) : (
         <div className={config.blogListClass}>
           {visibleBlogs.map((blog) => {
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
           className={config.showMoreClass}
         >
           <span>View all {blogs.length} articles</span>
           <ArrowRight size={11} strokeWidth={iconStrokeWidth + 0.4} />
         </Link>
       )}
     </section>
   </>
  )
}

export default Blogs
