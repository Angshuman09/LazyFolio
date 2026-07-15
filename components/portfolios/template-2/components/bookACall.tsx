import Image from "next/image"
import { Divider } from "./utils"
import { shouldOpenInNewTab } from "../../shared/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

function BookACall({ bookCallLink, avatar, name }: { bookCallLink: string, avatar: string, name: string }) {
    return (
        <>
            {bookCallLink && (
                <>
                    <Divider />
                    <section className="mb-2">
                        <Link
                            href={bookCallLink}
                            target={shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all duration-200"
                        >
                            {avatar && (
                                <Image
                                    src={avatar}
                                    alt={name || "Profile avatar"}
                                    width={24}
                                    height={24}
                                    unoptimized
                                    className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-200"
                                />
                            )}
                            <span className="text-[13px] text-stone-600 group-hover:text-stone-900 transition-colors">
                                Book a Free Call
                            </span>
                            <ArrowRight
                                size={11}
                                className="text-stone-400 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all"
                            />
                        </Link>
                    </section>
                </>
            )}
        </>
    )
}

export default BookACall