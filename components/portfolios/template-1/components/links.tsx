import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { shouldOpenInNewTab } from "../../shared/utils";
import { ArrowRight } from "lucide-react";
import { getLinkIcon } from "../../shared/link-icon";
import { trackClick } from "@/lib/utils/track-click";
import { NormalizedLink, ProfileData } from "../../shared/types";

const Links = ({profile, links, bookCallLink}:{profile: ProfileData, links: NormalizedLink[], bookCallLink: string}) => {
  return (
        <div className="flex flex-wrap gap-2 mb-4">
          {links.map((link) => (
            <Tooltip key={link.id}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                  target={
                    shouldOpenInNewTab(link.href) ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  title={link.label}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-zinc-500 border border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:text-zinc-200 transition-all duration-150"
                >
                  {getLinkIcon(link.label, link.href)}
                </Link>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-zinc-950 border border-zinc-200 [&_.bg-foreground]:bg-white [&_.fill-foreground]:fill-white">
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {bookCallLink && (
            <Link
              href={bookCallLink}
              target={
                shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined
              }
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-zinc-300 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-all duration-150 ml-auto"
            >
              Book a call
              <ArrowRight size={10} />
            </Link>
          )}
        </div>
      )
}

export default Links