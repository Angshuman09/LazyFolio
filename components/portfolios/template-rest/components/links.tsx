import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { normalizeLinks } from '../../shared/normalize';
import { ProfileData, TemplateThemeConfig } from '../../shared/types';
import Link from 'next/link';
import { shouldOpenInNewTab } from '../../shared/utils';
import { getLinkIcon } from '../../shared/link-icon';
import { ArrowRight } from 'lucide-react';

const Links = ({profile, config, bookCallLink, iconStrokeWidth}:{profile: ProfileData, bookCallLink: string, config: TemplateThemeConfig, iconStrokeWidth: number}) => {
  const links = normalizeLinks(profile?.links);
    const hasQuickActions = links.length > 0 || Boolean(bookCallLink);
    const iconSize = config.iconSize ?? 14;
  return (
    <>
              {hasQuickActions && (
            <div className={config.quickLinksClass}>
              {links.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={
                        shouldOpenInNewTab(link.href) ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      title={link.label}
                      className={config.quickLinkClass}
                    >
                      {getLinkIcon(link.label, link.href, iconSize, iconStrokeWidth)}
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
                  target={
                    shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  className={config.quickCtaClass}
                >
                  Book a call
                  <ArrowRight size={12} strokeWidth={iconStrokeWidth + 0.4} />
                </Link>
              )}
            </div>
          )}

    </>
  )
}

export default Links