import Image from "next/image"
import { cleanUrl, textValue } from "../../shared/utils";
import { ProfileData, UserData } from "../types/template.types";

const Hero = ({ profile, user, avatar, name }: { profile: ProfileData, user: UserData, avatar: string, name: string }) => {
    const tagline = textValue(profile?.tagline);
    const bio = textValue(profile?.bio);
    const banner = cleanUrl(profile?.banner);
    const hasHeroMedia = Boolean(banner || avatar);

    return (
        < section className="mb-8" >
            {hasHeroMedia && (
                <div className="relative mb-14">
                    {banner && (
                        <div className="relative h-38 sm:h-44 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                            <Image
                                src={banner}
                                alt={name ? `${name} banner` : "Portfolio banner"}
                                fill
                                unoptimized
                                className="object-cover opacity-85"
                            />
                        </div>
                    )}
                    {avatar && (
                        <Image
                            src={avatar}
                            alt={name || "Profile avatar"}
                            width={46}
                            height={46}
                            unoptimized
                            className={
                                banner
                                    ? "absolute left-3 -bottom-9 w-25 h-25 rounded-full object-cover "
                                    : "w-14 h-14 rounded-2xl object-cover ring-1 ring-zinc-700"
                            }
                        />
                    )}
                </div>
            )
            }
            {
                name && (
                    <h1 className="text-xl font-bold text-white mb-1 tracking-tight">
                        {name}
                    </h1>
                )
            }
            {
                tagline && (
                    <p className="text-xs text-zinc-600 font-mono mb-5">
                        {tagline}
                    </p>
                )
            }
            {bio && <p className="text-sm text-zinc-400 leading-[1.8]">{bio}</p>}
        </section >
    )
}

export default Hero