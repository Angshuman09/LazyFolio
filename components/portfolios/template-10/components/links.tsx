import Link from "next/link";
import { getLinkIcon } from "../../shared/link-icon";
import { shouldOpenInNewTab } from "../../shared/utils";
import { trackClick } from "@/lib/utils/track-click";
import { NormalizedLink, ProfileData } from "../../shared/types";

/* Flat horizontal row — icon + label, spaced by thin dots */
const Links = ({
  links,
  profile,
  bookCallLink,
}: {
  links: NormalizedLink[];
  profile: ProfileData;
  bookCallLink: string;
}) => {
  if (links.length === 0 && !bookCallLink) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 mb-2 mt-1">
      {links.map((link, idx) => (
        <span key={link.id} className="flex items-center gap-1">
          {idx > 0 && (
            <span className="text-[13px] mx-1 select-none" style={{ color: "#D1C4B8" }}>
              ·
            </span>
          )}
          <Link
            href={link.href}
            target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={() => trackClick(profile?.id ?? undefined, link.label)}
            className="inline-flex items-center gap-1 text-[12.5px] transition-colors group"
            style={{ color: "#6B7280" }}
          >
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
              {getLinkIcon(link.label, link.href, 12, 1.7)}
            </span>
            <span className="group-hover:text-fuchsia-500 transition-colors">
              {link.label.toLowerCase()}
            </span>
          </Link>
        </span>
      ))}

      {bookCallLink && (
        <>
          {links.length > 0 && (
            <span className="text-[13px] mx-1 select-none" style={{ color: "#D1C4B8" }}>
              ·
            </span>
          )}
          <Link
            href={bookCallLink}
            target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="text-[12.5px] font-medium transition-colors text-gray-500 hover:text-fuchsia-700"
          >
            book a call
          </Link>
        </>
      )}
    </div>
  );
};

export default Links;
