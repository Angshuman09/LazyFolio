import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { normalizeBlogs } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { shouldOpenInNewTab } from "../../shared/utils";
import { Empty, Section } from "./section";
import { MoreLink } from "./utils";

const rowClass =
  "group grid grid-cols-[95px_minmax(0,1fr)_auto] gap-3.5 border-b border-[#e8e9ec] py-4 max-[620px]:grid-cols-[minmax(0,1fr)_auto] max-[620px]:gap-2.5";

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
    <Section title="Notes">
      {blogs.length === 0 ? (
        <Empty>Writing will appear here.</Empty>
      ) : (
        <div className="border-t border-[#e8e9ec]">
          {visible.map((blog) => {
            const content = (
              <>
                <span className="font-mono pt-0.5 text-[10px] leading-[1.45] text-[#9a9ca5] max-[620px]:hidden">
                  {blog.readTime || "NOTE"}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 text-[15px] font-semibold leading-[1.4] tracking-[-0.02em] text-[#292b31] transition-colors duration-150 group-hover:text-[#255ac2]">
                    {blog.title || "Untitled article"}
                  </h3>
                  {blog.description && (
                    <p className="mt-1 line-clamp-2 text-[13px] leading-[1.5] text-[#73757e]">
                      {blog.description}
                    </p>
                  )}
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-[#a5a7ae] transition-colors duration-150 group-hover:text-[#255ac2]"
                  aria-hidden="true"
                />
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
              <div key={blog.id} className={rowClass}>
                {content}
              </div>
            );
          })}
        </div>
      )}

      {!showAll && blogs.length > visible.length && (
        <MoreLink href={basePath + "/blogs"} section="blogs">
          Read all notes
        </MoreLink>
      )}
    </Section>
  );
}
