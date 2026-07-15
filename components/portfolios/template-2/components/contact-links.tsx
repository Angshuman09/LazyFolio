import React from 'react'
import { addProfileContactLinks, shouldOpenInNewTab } from '../../shared/utils';
import { NormalizedLink, ProfileData } from '../../shared/types';
import { Divider, SectionHeading } from './utils';
import Link from 'next/link';
import { trackClick } from '@/lib/utils/track-click';
import { getLinkIcon } from '../../shared/link-icon';
import { MoveUpRight } from 'lucide-react';

const ContactLinks = ({profile, links}:{profile: ProfileData, links: NormalizedLink[]}) => {
  const contactLinks = addProfileContactLinks(links, profile);
  return (
    <>
    {contactLinks.length > 0 && (
            <>
              <Divider />
              <section>
                <SectionHeading>Let&apos;s connect</SectionHeading>
                <div className="space-y-0.5">
                  {contactLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      target={shouldOpenInNewTab(link.href) ? "_blank" : undefined}
                      onClick={() => trackClick(profile?.id ?? undefined, link.label)}
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-stone-500 group-hover:text-stone-800 transition-colors">
                          {getLinkIcon(link.label, link.href)}
                        </span>
                        <span className="text-[13px] text-stone-600 group-hover:text-stone-900 transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <MoveUpRight
                        size={11}
                        className="text-stone-300 group-hover:text-stone-500 transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
    </>
  )
}

export default ContactLinks