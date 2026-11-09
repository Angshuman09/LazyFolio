import Link from "next/link";
import { normalizeBlogs } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Empty, Section } from "./section";
import { MoreLink } from "./utils";

const rowClass =
  "group grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[#ececef] py-4 max-[430px]:grid-cols-1 max-[430px]:gap-1.5";

export default function Blogs({
  profile,
  showAll = false,
  basePath = "",
}: {
  profile: ProfileData;
  showAll?: boolean;
  basePath?: string;
}) {
  const blogs = normalizeBlogs(profile?.blogs, profile?.username);
  const visible = showAll ? blogs : blogs.slice(0, 4);

  if (!showAll && blogs.length === 0) return null;

  return (
    <Section id="lf-t4-writing-title" title="Thoughts">
      {blogs.length === 0 ? (
        <Empty>Writing will appear here.</Empty>
      ) : (
        <div>
          {visible.map((blog) => {
            const content = (
              <>
                <div className="min-w-0">
                  <h3 className="m-0 text-[16px] font-medium leading-[1.35] tracking-[-0.025em] text-[#19191b] transition-colors duration-150 group-hover:text-purple-600">
                    {blog.title || "Untitled article"}
                  </h3>
                  {blog.description && (
                    <p className="mt-[7px] line-clamp-2 text-[14px] leading-[1.52] text-[#6d6d75]">
                      {blog.description}
                    </p>
                  )}
                </div>
                {blog.readTime && (
                  <span className="pt-0.5 text-right text-[12px] text-[#919199] whitespace-nowrap max-[430px]:p-0 max-[430px]:text-left">
                    {blog.readTime}
                  </span>
                )}
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
                {content}
              </Link>
            ) : (
              <article key={blog.id} className={rowClass}>
                {content}
              </article>
            );
          })}
        </div>
      )}

      {!showAll && blogs.length > visible.length && (
        <MoreLink href={basePath + "/blogs"} section="blogs">
          See all writing
        </MoreLink>
      )}
    </Section>
  );
}
