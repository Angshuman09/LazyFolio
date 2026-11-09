import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { getMainSiteUrl } from "@/lib/utils/public-url";
import { trackClick } from "@/lib/utils/track-click";
import { getLinkIcon } from "../../shared/link-icon";
import { normalizeLinks } from "../../shared/normalize";
import type { ProfileData } from "../../shared/types";
import { cleanUrl, shouldOpenInNewTab, textValue } from "../../shared/utils";

const footerLinkClass = "inline-flex items-center gap-[6px] rounded-md px-1 py-1.5 -mx-1 text-[14px] text-gray-500 transition-colors duration-150 hover:text-purple-600";

export default function Footer({ profile }: { profile: ProfileData }) {
  const links = normalizeLinks(profile?.links);
  const email = textValue(profile?.email);
  const resume = cleanUrl(profile?.resume);

  return (
    <footer className="mt-19">
      {(links.length > 0 || email || resume) && (
        <>
          <span className="mb-3 block text-[13px] text-[#85858c]">
            Elsewhere
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                className={footerLinkClass}
              >
                {getLinkIcon(link.label, link.href, 14, 1.6)}
                {link.label}
              </Link>
            ))}
            {email && (
              <Link href={"mailto:" + email} className={footerLinkClass}>
                <Mail size={14} strokeWidth={1.6} aria-hidden="true" />
                Email
              </Link>
            )}
            {resume && (
              <Link
                href={resume}
                target={shouldOpenInNewTab(resume) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={footerLinkClass}
              >
                Résumé
                <ArrowUpRight size={13} strokeWidth={1.6} aria-hidden="true" />
              </Link>
            )}
          </div>
        </>
      )}

      <div className="mt-[26px] flex justify-between gap-3 text-[12px] text-[#9a9aa1]">
        <Link
          href={getMainSiteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-150 hover:text-[#696971]"
        >
          Built with Lazyfolio
        </Link>
      </div>
    </footer>
  );
}
