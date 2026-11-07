import Image from "next/image";
import { MapPin } from "lucide-react";
import type { ProfileData } from "../../shared/types";
import { textValue } from "../../shared/utils";
import { initialsOf } from "./utils";

export default function Hero({
  profile,
  name,
  tagline,
  avatar,
}: {
  profile: ProfileData;
  name: string;
  tagline: string;
  avatar: string;
}) {
  const location = textValue(profile?.location);

  return (
    <>
      <div
        className="h-[154px] border-b border-[#e6e7e9] max-[620px]:h-[104px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d2d4d8 1.15px, transparent 1.3px)",
          backgroundPosition: "18px 18px",
          backgroundSize: "10px 10px",
        }}
        aria-hidden="true"
      />

      <section
        className="grid min-h-[177px] grid-cols-[168px_minmax(0,1fr)] border-b border-[#e6e7e9] max-[620px]:min-h-0 max-[620px]:grid-cols-[112px_minmax(0,1fr)]"
        aria-labelledby="lf-t8-name"
      >
        <div className="flex items-center justify-center border-r border-[#e6e7e9] p-[22px] max-[620px]:p-4">
          {avatar ? (
            <div className="h-[126px] w-[126px] overflow-hidden rounded-[13px] border border-[#dedfe3] bg-[#f7f8f8] max-[620px]:h-20 max-[620px]:w-20 max-[620px]:rounded-[10px]">
              <Image
                src={avatar}
                alt={name}
                width={252}
                height={252}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className="flex h-[126px] w-[126px] items-center justify-center rounded-[13px] border border-[#dedfe3] text-[33px] tracking-[-0.08em] text-[#12232c] max-[620px]:h-20 max-[620px]:w-20 max-[620px]:rounded-[10px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #d2d7d9 1px, transparent 1.15px)",
                backgroundSize: "7px 7px",
              }}
              aria-hidden="true"
            >
              {initialsOf(name)}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center px-[26px] py-6 max-[620px]:p-[18px]">
          <h1
            id="lf-t8-name"
            className="font-sans-body m-0 text-[clamp(29px,4.5cqw,38px)] font-normal leading-[0.96] tracking-[-0.055em] text-[#22242a] break-words max-[620px]:text-[29px]"
          >
            {name}
          </h1>
          {tagline && (
            <p className="mt-2.5 text-[15px] leading-[1.45] text-[#858791] max-[620px]:mt-1.5 max-[620px]:text-[13px]">
              {tagline}
            </p>
          )}
          {location && (
            <p className="mt-[7px] inline-flex items-center gap-1.5 text-[12px] text-[#9a9ca4]">
              <MapPin size={12} strokeWidth={1.6} aria-hidden="true" />
              {location}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
