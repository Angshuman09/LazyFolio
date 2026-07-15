import Link from 'next/link'
import Image from 'next/image'
import { Divider } from './utils'
import { shouldOpenInNewTab } from '../../shared/utils'
import { ArrowRight } from 'lucide-react'

const BookACall = ({avatar, bookCallLink, name}:{avatar: string, bookCallLink: string, name: string}) => {
  return (
    <>
        {bookCallLink && (
            <>
              <Divider />
              <section>
                <Link
                  href={bookCallLink}
                  target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-150"
                >
                  {avatar && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={avatar}
                        alt={name || "Profile avatar"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900">
                      Let&apos;s build together
                    </p>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      Book a slot on my calendar to talk.
                    </p>
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
                  />
                </Link>
              </section>
            </>
          )}
    </>
  )
}

export default BookACall