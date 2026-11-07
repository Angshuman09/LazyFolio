import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { trackClick } from "@/lib/utils/track-click";
import { getLinkIcon } from "../../shared/link-icon";
import { normalizeLinks } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import {
  cleanUrl,
  getBookCallLink,
  shouldOpenInNewTab,
  textValue,
} from "../../shared/utils";
import { Section } from "./section";

const itemClass =
  "flex min-h-[58px] items-center justify-between gap-3 border-b border-[#e8e9ec] px-[27px] py-4 text-[14px] text-[#383a40] transition-colors duration-150 odd:border-r hover:bg-[#f7f9fc] hover:text-[#255ac2] max-[620px]:min-h-[54px] max-[620px]:px-[18px] max-[620px]:py-3 max-[620px]:odd:border-r-0";
const labelClass = "flex min-w-0 items-center gap-2";
const textClass = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function Connect({ profile }: { profile: ProfileData }) {
  const links = normalizeLinks(profile?.links);
  const email = textValue(profile?.email);
  const resume = cleanUrl(profile?.resume);
  const bookCallLink = getBookCallLink(profile);
  const itemCount =
    links.length + [email, bookCallLink, resume].filter(Boolean).length;

  if (links.length === 0 && !email && !resume && !bookCallLink) return null;

  return (
    <Section title="Connect" flush>
      <div className="grid grid-cols-2 max-[620px]:grid-cols-1">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={itemClass}
            onClick={() => trackClick(profile?.id ?? undefined, link.label)}
          >
            <span className={labelClass}>
              {getLinkIcon(link.label, link.href, 14, 1.6)}
              <span className={textClass}>{link.label}</span>
            </span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ))}

        {email && (
          <a href={"mailto:" + email} className={itemClass}>
            <span className={labelClass}>
              <Mail size={14} strokeWidth={1.6} aria-hidden="true" />
              <span className={textClass}>Email</span>
            </span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}

        {bookCallLink && (
          <a
            href={bookCallLink}
            target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={itemClass}
          >
            <span className={labelClass}>
              <span className={textClass}>Book a call</span>
            </span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}

        {resume && (
          <a
            href={resume}
            target={shouldOpenInNewTab(resume) ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={itemClass}
          >
            <span className={labelClass}>
              <FileText size={14} strokeWidth={1.6} aria-hidden="true" />
              <span className={textClass}>Résumé</span>
            </span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}

        {itemCount % 2 === 1 && (
          <div
            className="border-b border-[#e8e9ec] max-[620px]:hidden"
            aria-hidden="true"
          />
        )}
      </div>
    </Section>
  );
}
