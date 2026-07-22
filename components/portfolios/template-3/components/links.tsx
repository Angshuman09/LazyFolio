
import { ProfileData } from '../../shared/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { shouldOpenInNewTab } from '../../shared/utils';
import { getLinkIcon } from '../../shared/link-icon';
import { ArrowRight } from 'lucide-react';
import { normalizeLinks } from '../../shared/normalize';
import { trackClick } from '@/lib/utils/track-click';

const Links = ({ profile, bookCallLink}:{profile: ProfileData, bookCallLink:string }) => {
  const links = normalizeLinks(profile?.links);
  const hasQuickActions = links.length > 0 || Boolean(bookCallLink);
  return (
    <>
    {hasQuickActions && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      title={link.label}
                      onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 border border-slate-200 bg-white hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150"
                    >
                      {getLinkIcon(link.label, link.href)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {bookCallLink && (
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[11px] font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 transition-colors duration-150 ml-auto"
                >
                  Book a call
                  <ArrowRight size={10} className="stroke-[2.5]" />
                </Link>
              )}
            </div>
          )}
    </>
  )
}

export default Links