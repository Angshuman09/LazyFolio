import Image from "next/image"
import { textValue } from "../../shared/utils";
import { ProfileData } from "../../shared/types";

const Hero = ({avatar, banner, profile, name}: {avatar:string, banner: string, profile: ProfileData, name: string}) => {
  const hasHeroMedia = Boolean(banner || avatar);
  const tagline = textValue(profile?.tagline);
  const bio = textValue(profile?.bio);
  return (
    <section className="mb-8">
    {hasHeroMedia && (
      <div className="relative mb-9">
        {banner && (
          <div className="relative h-32 sm:h-55 rounded-xl overflow-hidden border border-stone-200 bg-white">
            <Image
              src={banner}
              alt={name ? `${name} banner` : "Portfolio banner"}
              fill
              unoptimized
              className="object-cover opacity-90"
            />
          </div>
        )}
        {avatar && (
          <Image
            src={avatar}
            alt={name || "Profile avatar"}
            width={80}
            height={80}
            unoptimized
            className={
              banner
                ? "absolute left-4 -bottom-8 w-20 h-20 rounded-lg object-cover ring-1 ring-[#fbfbfb] border border-stone-200 bg-white"
                : "w-20 h-20 rounded-lg object-cover border border-stone-200 bg-white"
            }
          />
        )}
      </div>
    )}
    {name && (
      <h1 className="text-xl font-bold text-stone-900 mb-1 tracking-tight">
        {name}
      </h1>
    )}
    {tagline && (
      <p className="text-xs text-stone-400 font-mono mb-5">{tagline}</p>
    )}
    {bio && (
      <p className="text-sm text-stone-600 leading-[1.8]">{bio}</p>
    )}
  </section>
  )
}

export default Hero