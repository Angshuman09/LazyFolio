import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { shouldOpenInNewTab } from '../../shared/utils'
import { Divider } from './utils'

const BookACall = ({avatar, bookCallLink, name}:{avatar:string, bookCallLink:string, name:string}) => {
  return (
    <>
    <Divider />
    <section className="mb-2">
      <Link
        href={bookCallLink}
        target={
          shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined
        }
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-200"
      >
        {avatar && (
          <Image
            src={avatar}
            alt={name || "Profile avatar"}
            width={24}
            height={24}
            unoptimized
            className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-700"
          />
        )}
        <span className="text-[13px] text-zinc-400 group-hover:text-white transition-colors">
          Book a Free Call
        </span>
        <ArrowRight
          size={11}
          className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all"
        />
      </Link>
    </section>
  </>
  )
}

export default BookACall