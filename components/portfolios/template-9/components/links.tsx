import Link from "next/link";
import { getLinkIcon } from "../../shared/link-icon";
import { shouldOpenInNewTab } from "../../shared/utils";
import { trackClick } from "@/lib/utils/track-click";
import { NormalizedLink, ProfileData } from "../../shared/types";

/* Flat text links with icon — no button borders */
const Links = ({
  profile,
  links,
  bookCallLink,
}: {
  profile: ProfileData;
  links: NormalizedLink[];
  bookCallLink: string;
}) => {
  if (links.length === 0 && !bookCallLink) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7 mb-2">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={() => trackClick(profile?.id ?? undefined, link.label)}
          className="inline-flex items-center gap-1.5 text-[12px] transition-colors group"
          style={{ color: "#8C7B6A" }}
        >
          <span className="opacity-70 group-hover:opacity-100 transition-opacity">
            {getLinkIcon(link.label, link.href, 12, 1.6)}
          </span>
          <span
            className="group-hover:text-[#1C1814] transition-colors"
            style={{ textDecoration: "underline", textDecorationColor: "#D8D0C5", textUnderlineOffset: "3px" }}
          >
            {link.label.toLowerCase()}
          </span>
        </Link>
      ))}
      {bookCallLink && (
        <Link
          href={bookCallLink}
          target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-[12px] transition-colors"
          style={{ color: "#B25C2A", textDecoration: "underline", textDecorationColor: "#B25C2A", textUnderlineOffset: "3px" }}
        >
          book a call ↗
        </Link>
      )}
    </div>
  );
};

export default Links;
