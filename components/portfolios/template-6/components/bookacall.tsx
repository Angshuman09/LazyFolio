import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Divider } from "./utils"
import { shouldOpenInNewTab } from "../../shared/utils"

const BookACall = ({avatar, name, bookCallLink}:{avatar: string, name: string, bookCallLink: string}) => {
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
                  className="flex items-center gap-4 rounded-2xl bg-[#1A3D2B] px-6 py-5 no-underline text-[#FDF6EC] transition-colors duration-150 hover:bg-[#C4622D]"
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name || "Avatar"}
                      width={46} height={46}
                      unoptimized
                      className="rounded-[10px] border-2 border-[rgba(196,98,45,0.55)] object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-11.5 h-11.5 rounded-[10px] shrink-0 border-2 border-[rgba(253,246,236,0.2)] block" />
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-[#FDF6EC]">
                      Let&apos;s talk
                    </span>
                    <span className="block mt-1 text-xs leading-[1.55] text-[rgba(253,246,236,0.62)]">
                      Book a slot to discuss a project or collaboration.
                    </span>
                  </span>
                  <ArrowRight size={16} strokeWidth={2} color="#FAE8DC" className="shrink-0" />
                </Link>
              </section>
            </>
          )}
    </>
  )
}

export default BookACall