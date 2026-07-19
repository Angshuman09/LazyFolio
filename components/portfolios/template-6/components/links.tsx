
import { normalizeLinks } from '../../shared/normalize';
import { ProfileData } from '../../shared/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { shouldOpenInNewTab } from '../../shared/utils';
import { getLinkIcon } from '../../shared/link-icon';
import { ArrowRight } from 'lucide-react';
import { trackClick } from '@/lib/utils/track-click';

const Links = ({profile, bookCallLink}:{profile: ProfileData, bookCallLink: string}) => {
  const links = normalizeLinks(profile?.links);
  return (
   <>
             {(links.length > 0 || bookCallLink) && (
            <div className="flex flex-wrap items-center gap-2 mb-11">
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                      className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] text-[#3D5247] transition-colors duration-150 no-underline hover:bg-[#D5E5DA] hover:text-[#1A3D2B]"
                    >
                      {getLinkIcon(link.label, link.href, 14, 1.8)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent><p>{link.label}</p></TooltipContent>
                </Tooltip>
              ))}

              {bookCallLink && (
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-[6px] h-[38px] px-[18px] rounded-[10px] bg-[#1A3D2B] text-[#FDF6EC] text-xs font-bold transition-colors duration-150 no-underline hover:bg-[#C4622D]"
                >
                  Book a call
                  <ArrowRight size={12} strokeWidth={2.2} />
                </Link>
              )}
            </div>
          )}
   </>
  )
}

export default Links