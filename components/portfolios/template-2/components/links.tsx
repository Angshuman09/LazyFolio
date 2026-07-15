import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { shouldOpenInNewTab } from '../../shared/utils'
import { trackClick } from '@/lib/utils/track-click'
import { NormalizedLink, ProfileData } from '../../shared/types'
import { getLinkIcon } from '../../shared/link-icon'
import { ArrowRight } from 'lucide-react'

const Links = ({links, profile, bookCallLink}:{links:NormalizedLink[], profile: ProfileData, bookCallLink:string}) => {
  const hasQuickActions = links.length > 0 || Boolean(bookCallLink);
    return (
        <>
        {hasQuickActions && (
        <div className="flex flex-wrap gap-2 mb-4">
            {links.map((link) => (
                <Tooltip key={link.id}>
                    <TooltipTrigger asChild>
                        <Link
                            href={link.href}
                            target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                            title={link.label}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-stone-500 border border-stone-200 bg-white/60 hover:border-stone-300 hover:text-stone-800 hover:bg-stone-50 transition-all duration-150"
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
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-stone-700 border border-stone-200 bg-stone-100 hover:bg-stone-200 transition-all duration-150 ml-auto font-medium"
                >
                    Book a call
                    <ArrowRight size={10} />
                </Link>
            )}
        </div>
    )}
    </>
    )
}

export default Links