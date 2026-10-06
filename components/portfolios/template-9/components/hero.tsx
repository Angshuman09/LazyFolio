import Image from "next/image";
import { ProfileData } from "../../shared/types";
import { textValue } from "../../shared/utils";

const Hero = ({
  profile,
  avatar,
  name,
}: {
  profile: ProfileData;
  avatar: string;
  name: string;
}) => {
  const tagline = textValue(profile?.tagline);
  const bio = textValue(profile?.bio);

  return (
    <section className="mb-8">
      {/* Optional small avatar */}
      {avatar && (
        <div className="mb-6">
          <Image
            src={avatar}
            alt={name || "Profile"}
            width={52}
            height={52}
            unoptimized
            className="rounded-full object-cover"
            style={{ border: "1px solid #C8BDB0" }}
          />
        </div>
      )}

      {/* HUGE serif name — the signature element */}
      <h1
        className="
        font-serif-display
        text-[34px]
        md:text-[34px]
        leading-[1.05]
        font-normal
        tracking-[-0.02em]
        text-[#1C1814]
        mb-3
      "
      >
        {name}
      </h1>

      {tagline && (
        <p
          className="text-[11px] tracking-[0.2em] uppercase mb-6"
          style={{ color: "#A0907E" }}
        >
          {tagline}
        </p>
      )}

      {bio && (
        <p
          className="text-[14.5px] leading-[1.9] max-w-md"
          style={{ color: "#5C5044" }}
        >
          {bio}
        </p>
      )}
    </section>
  );
};

export default Hero;
