
import Link from 'next/link'
import { trackClick } from '@/lib/utils/track-click'
import { getLinkIcon } from './github-links'
import { MoveUpRight } from 'lucide-react'
import { NormalizedLink, ProfileData } from '../../shared/types'
import { shouldOpenInNewTab } from '../../shared/utils'
import { Divider, SectionHeading } from './utils'

const ContactInfo = ({contactLinks, profile}: {contactLinks:NormalizedLink[], profile: ProfileData}) => {
  return (
    <>
    <Divider />
    <section>
      <SectionHeading>Let&apos;s connect</SectionHeading>
      <div className="space-y-0.5">
        {contactLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            target={
              shouldOpenInNewTab(link.href) ? "_blank" : undefined
            }
            onClick={() => trackClick(profile?.id ?? undefined, link.label)}
            rel="noopener noreferrer"
            className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 transition-all duration-150"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-zinc-500 group-hover:text-zinc-200 transition-colors">
                {getLinkIcon(link.label, link.href)}
              </span>
              <span className="text-[13px] text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {link.label}
              </span>
            </div>
            <MoveUpRight
              size={11}
              className="text-zinc-700 group-hover:text-zinc-500 transition-colors"
            />
          </Link>
        ))}
      </div>
    </section>
  </>
  )
}

export default ContactInfo