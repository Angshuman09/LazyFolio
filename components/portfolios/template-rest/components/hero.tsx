import Image from "next/image"
import { cleanUrl, textValue } from "../../shared/utils";
import { ProfileData, TemplateThemeConfig } from "../../shared/types";

const Hero = ({profile, avatar, name, config}:{profile: ProfileData, avatar: string, name: string, config: TemplateThemeConfig}) => {
    const tagline = textValue(profile?.tagline);
  const banner = cleanUrl(profile?.banner);
  const hasHeroMedia = Boolean(banner || avatar);
    const bio = textValue(profile?.bio);
  return (
    <section className={`lf-themed-hero ${config.heroClass}`}>
    {hasHeroMedia && (
      <div className={config.heroMediaClass}>
        {banner && (
          <div className={`lf-themed-banner ${config.bannerClass}`}>
            <Image
              src={banner}
              alt={name ? `${name} banner` : "Portfolio banner"}
              fill
              unoptimized
              className="object-cover"
            />
            <div className={config.bannerOverlayClass} />
          </div>
        )}
        {avatar && (
          <Image
            src={avatar}
            alt={name || "Profile avatar"}
            width={92}
            height={92}
            unoptimized
            className={
              banner
                ? config.avatarWithBannerClass
                : config.avatarSoloClass
            }
          />
        )}
      </div>
    )}

    <div>
      {name && (
        <h1 className={`lf-themed-name ${config.nameClass}`}>
          {name}
        </h1>
      )}
      {tagline && <p className={config.taglineClass}>{tagline}</p>}
      {bio && <p className={config.bioClass}>{bio}</p>}
    </div>
  </section>

  )
}

export default Hero