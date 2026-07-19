import Image from "next/image"
import { cleanUrl, textValue } from "../../shared/utils";
import { ProfileData } from "../../shared/types";

const Hero = ({ profile, name, avatar }: { profile: ProfileData, name: string, avatar: string }) => {
    const quote = textValue(profile?.quote);
    const tagline = textValue(profile?.tagline);
    const bio = textValue(profile?.bio);
    const banner = cleanUrl(profile?.banner);
    return (
        <>
            {quote && (
                <p className="mb-6 py-[13px] pl-5 pr-[18px] border-l-[3px] border-[#C4622D] bg-[#FAE8DC] rounded-r-[10px] text-[13px] leading-[1.75] text-[#7A4020] italic">
                    &ldquo;{quote}&rdquo;
                </p>
            )}

            <section className="mb-5 rounded-[20px] border-[1.5px] border-[#D5E5DA] bg-[#EEF4F0] overflow-hidden shadow-[0_4px_24px_rgba(26,61,43,0.07)]">

                {banner ? (
                    <div className="relative h-[180px] overflow-hidden">
                        <Image
                            src={banner}
                            alt={name ? `${name} banner` : "Banner"}
                            fill unoptimized
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[45%] to-[rgba(26,61,43,0.28)]" />
                    </div>
                ) : (
                    <div className="h-[158px] bg-[#1A3D2B] relative overflow-hidden">
                        <div className="absolute -top-[50px] -right-[50px] w-[220px] h-[220px] rounded-full bg-[rgba(196,98,45,0.22)]" />
                        <div className="absolute -bottom-10 left-[50px] w-[140px] h-[140px] rounded-full bg-[rgba(196,98,45,0.13)]" />
                        <div className="absolute top-[30px] -left-[25px] w-[90px] h-[90px] rounded-full bg-[rgba(238,244,240,0.07)]" />
                    </div>
                )}

                <div className="px-[26px] pb-7 relative z-40">
                    {avatar ? (
                        <div className="mt-[-38px] mb-[14px]">
                            <Image
                                src={avatar}
                                alt={name || "Avatar"}
                                width={82} height={82}
                                unoptimized
                                className="rounded-[14px] border-[3px] border-[#C4622D] object-cover block shadow-[0_4px_18px_rgba(196,98,45,0.22)]"
                            />
                        </div>
                    ) : (
                        <div className="h-[18px]" />
                    )}

                    {name && (
                        <h1 className="text-[40px] max-[580px]:text-[26px] font-extrabold tracking-[-0.025em] leading-[1.05] text-[#1A3D2B] m-0">
                            {name}
                        </h1>
                    )}

                    {tagline && (
                        <p className="mt-2 mb-0 text-[11px] font-bold tracking-[0.18em] uppercase text-[#C4622D]">
                            {tagline}
                        </p>
                    )}

                    {bio && (
                        <p className="mt-[14px] mb-0 text-sm leading-[1.85] text-[#3D5247] max-w-[520px]">
                            {bio}
                        </p>
                    )}
                </div>
            </section>
        </>
    )
}

export default Hero