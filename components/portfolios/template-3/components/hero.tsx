import Image from "next/image"
import { ProfileData } from "../../shared/types";
import { textValue } from "../../shared/utils";

const Hero = ({profile, banner, avatar, name}:{profile: ProfileData, banner: string, avatar: string, name: string}) => {
    const tagline = textValue(profile?.tagline);
    const bio = textValue(profile?.bio);
    const hasHeroMedia = Boolean(banner || avatar);
  return (
    <section className="mb-10">
    {hasHeroMedia && (
      <div className="relative mb-2">
        {banner && (
          <div className="relative h-36 sm:h-52 rounded-xl overflow-hidden">
            <Image
              src={banner}
              alt={name ? `${name} banner` : "Portfolio banner"}
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>
        )}
        {avatar && (
          <div
            className={
              banner
                ? "absolute left-5 -bottom-9 ring-1 ring-white border border-[#bfbfbf] bg-white rounded-xl overflow-hidden shadow-sm"
                : "mb-6 rounded-xl overflow-hidden w-17 h-17"
            }
          >
            <Image
              src={avatar}
              alt={name || "Profile avatar"}
              width={banner ? 80 : 68}
              height={banner ? 80 : 68}
              unoptimized
              className="object-cover aspect-square"
            />
          </div>
        )}
      </div>
    )}

    <div className={banner ? "pt-12" : "pt-0"}>
      {name && (
        <h1 className="text-[28px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-[1.15] mb-2">
          {name}
        </h1>
      )}
      {tagline && (
        <p className="text-[12px] font-medium text-slate-400 tracking-wide mb-4">
          {tagline}
        </p>
      )}
      {bio && (
        <p className="text-[14px] text-slate-500 leading-[1.8] max-w-lg">
          {bio}
        </p>
      )}
    </div>
  </section>
  )
}

export default Hero