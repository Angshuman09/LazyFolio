import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import { NormalizedLink, ProfileData } from "../../shared/types";
import { getLinkIcon } from "../../shared/link-icon";
import { shouldOpenInNewTab } from "../../shared/utils";
import { trackClick } from "@/lib/utils/track-click";
import { Divider, SectionHeading } from "./utils";

const ContactInfo = ({
  contactLinks,
  profile,
}: {
  contactLinks: NormalizedLink[];
  profile: ProfileData;
}) => {
  return (
    <>
      <Divider />
      <section>
        <SectionHeading>Connect</SectionHeading>
        <div className="flex gap-5">
          {contactLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => trackClick(profile?.id ?? undefined, link.label)}
              className="group flex items-center justify-between py-2 transition-colors"
              style={{ borderBottom: "1px solid #EBE4DA" }}
            >
              <div className="flex items-center gap-1">
                <span className="transition-colors group-hover:text-[#184E42]" style={{ color: "#9E9080" }}>
                  {getLinkIcon(link.label, link.href, 13, 1.6)}
                </span>
                <span
                  className="text-[13px] transition-colors group-hover:text-[#184E42]"
                  style={{ color: "#5C5044" }}
                >
                  {link.label}
                </span>
              </div>
              <MoveUpRight
                size={11}
                className="transition-colors group-hover:text-[#184E42]"
                style={{ color: "#B5A898" }}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default ContactInfo;
