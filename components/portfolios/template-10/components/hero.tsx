import Image from "next/image";
import { ProfileData } from "../../shared/types";
import { textValue } from "../../shared/utils";

const Hero = ({
  avatar,
  banner,
  profile,
  name,
}: {
  avatar: string;
  banner: string;
  profile: ProfileData;
  name: string;
}) => {
  const tagline = textValue(profile?.tagline);
  const bio = textValue(profile?.bio);

  return (
    <section className="mb-7">
      {/* Banner */}
      {banner && (
        <div
          className="relative w-full h-28 sm:h-36 mb-7 rounded-xl overflow-hidden"
          style={{ background: "#F5EFE8" }}
        >
          <Image src={banner} alt="" fill unoptimized className="object-cover opacity-80" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        {avatar && (
          <Image
            src={avatar}
            alt={name || "Profile"}
            width={56}
            height={56}
            unoptimized
            className="rounded-full object-cover shrink-0 mt-1"
            style={{ border: "2px solid #F0EBE5" }}
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Name — indigo */}
          {name && (
            <h1
              className="text-[28px] sm:text-[32px] font-bold leading-tight text-[#333333] font-serif-display tracking-wide"
            >
              {name}
            </h1>
          )}

          {/* Dot-separated tagline like the reference */}
          {tagline && (
            <p
              className="text-[13px] mt-1 font-medium"
              style={{ color: "#9CA3AF", letterSpacing: "0.01em" }}
            >
              {tagline
                .split(/[,|·•]/)
                .map((s) => s.trim())
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>

      {bio && (
        <p
          className="text-[14px] leading-[1.6] mt-5 max-w-xl font-mono"
          style={{ color: "#374151" }}
        >
          {bio}
        </p>
      )}
    </section>
  );
};

export default Hero;
