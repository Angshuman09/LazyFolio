import Image from "next/image"
import { Divider } from "../../shared/components/divider"
import { shouldOpenInNewTab } from "../../shared/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TemplateThemeConfig } from "../../shared/types"


const BookACall = ({bookCallLink, config, avatar, name, iconStrokeWidth}: {bookCallLink: string, config:TemplateThemeConfig, avatar: string , name: string, iconStrokeWidth: number}) => {
  return (
    <>
              {bookCallLink && (
            <>
              <Divider config={config} />
              <section>
                <Link
                  href={bookCallLink}
                  target={
                    shouldOpenInNewTab(bookCallLink) ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  className={config.footerCtaClass}
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name || "Profile avatar"}
                      width={44}
                      height={44}
                      unoptimized
                      className={config.footerAvatarClass}
                    />
                  ) : (
                    <span className={config.footerAvatarClass} />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className={config.footerCtaTitleClass}>
                      Let&apos;s talk
                    </span>
                    <span className={config.footerCtaTextClass}>
                      Book a slot to discuss a project or collaboration.
                    </span>
                  </span>
                  <ArrowRight
                    size={14}
                    strokeWidth={iconStrokeWidth + 0.3}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </section>
            </>
          )}

    </>
  )
}

export default BookACall