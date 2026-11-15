import { ProfileData } from "../../shared/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { shouldOpenInNewTab } from "../../shared/utils";
import { getLinkIcon } from "../../shared/link-icon";
import { normalizeLinks } from "../../shared/normalize";
import { trackClick } from "@/lib/utils/track-click";

interface LinksProps {
  profile: ProfileData;
}

export default function Links({ profile }: LinksProps) {
  const links = normalizeLinks(profile?.links);

  if (links.length === 0) return null;

  return (
    <div className="mt-16 sm:mt-20 pt-2 flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <Tooltip key={link.id}>
          <TooltipTrigger asChild>
            <Link
              href={link.href}
              target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              title={link.label}
              onClick={() => trackClick(profile?.id ?? undefined, link.label)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-neutral-400 hover:text-neutral-100 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-150"
            >
              <span className="text-neutral-400">{getLinkIcon(link.label, link.href)}</span>
              <span>{link.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-neutral-800 text-neutral-200 border-neutral-700 text-xs">
            <p>{link.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
