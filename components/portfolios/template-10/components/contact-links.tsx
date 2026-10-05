import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NormalizedLink, ProfileData } from "../../shared/types";
import { getLinkIcon } from "../../shared/link-icon";
import { shouldOpenInNewTab } from "../../shared/utils";
import { trackClick } from "@/lib/utils/track-click";
import { Divider, SectionHeading } from "./utils";

const ContactLinks = ({
  links,
  profile,
}: {
  links: NormalizedLink[];
  profile: ProfileData;
}) => {
  if (!links || links.length === 0) return null;
  return (
    <>
      <Divider />
      <section>
        <SectionHeading>Get in touch</SectionHeading>
        <div className="flex flex-row gap-2">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => trackClick(profile?.id ?? undefined, link.label)}
              className="inline-flex items-center gap-2 text-[13px] transition-colors group w-fit"
              style={{ color: "#6B7280" }}
            >
              <span
                className="transition-colors group-hover:text-[#1D4ED8]"
                style={{ color: "#C4B8AC" }}
              >
                {getLinkIcon(link.label, link.href, 13, 1.6)}
              </span>
              <span className="group-hover:text-fuchsia-500 transition-colors">
                {link.label}
              </span>
              <ArrowUpRight
                size={11}
                className="opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-fuchsia-500"
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default ContactLinks;
