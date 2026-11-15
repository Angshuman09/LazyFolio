import Image from "next/image";
import Link from "next/link";
import { ProfileData } from "../../shared/types";
import { textValue, shouldOpenInNewTab } from "../../shared/utils";
import { normalizeLinks } from "../../shared/normalize";
import { FormattedText, toParagraphs } from "./utils";

interface HeroProps {
  profile: ProfileData;
  user?: { name?: string | null; image?: string | null };
  avatar: string;
  name: string;
}

export default function Hero({
  profile,
  user,
  avatar,
  name,
}: HeroProps) {
  const bio = textValue(profile?.bio);
  const username = textValue(profile?.username);
  const rawName = name || textValue(profile?.name) || textValue(user?.name);
  const tagline = textValue(profile?.tagline);

  // Derive handle like @angshuman
  const handle = username
    ? `@${username.replace(/^@/, "")}`
    : rawName
    ? `@${rawName.toLowerCase().replace(/\s+/g, "")}`
    : "@portfolio";

  // Display name under handle (e.g. Angshuman Kashyap)
  const displayName = rawName || tagline;

  // Check if user has an X/Twitter link to mirror Josh Puckett's @handle link
  const links = normalizeLinks(profile?.links);
  const xLink = links.find(
    (l) =>
      /x\.com|twitter\.com/i.test(l.href) ||
      /^(x|twitter)$/i.test(l.label)
  );

  const bioParagraphs = toParagraphs(bio);

  return (
    <header className="mb-12">
      {/* PFP & Handle / Name arranged horizontally */}
      <div className="flex items-center gap-4 sm:gap-5">
        {avatar ? (
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-neutral-800 ring-1 ring-white/10 shrink-0 bg-neutral-900 shadow-sm">
            <Image
              src={avatar}
              alt={rawName || "Profile avatar"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : rawName ? (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-neutral-800 ring-1 ring-white/10 bg-neutral-900 flex items-center justify-center text-neutral-300 font-mono text-base shrink-0 shadow-sm">
            {rawName.charAt(0).toUpperCase()}
          </div>
        ) : null}

        <div className="flex flex-col justify-center min-w-0">
          <h1 className="font-editorial-serif text-[22px] sm:text-[24px] font-normal tracking-[-0.01rem] text-neutral-100 leading-tight">
            {xLink ? (
              <Link
                href={xLink.href}
                target={shouldOpenInNewTab(xLink.href) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                {handle}
              </Link>
            ) : (
              <span>{handle}</span>
            )}
          </h1>

          {displayName && (
            <p className="text-[14px] sm:text-[15px] text-neutral-400 font-normal leading-tight mt-1 truncate">
              {displayName}
            </p>
          )}
        </div>
      </div>

      {/* Josh Puckett signature thin accent line */}
      <div className="w-12 h-px bg-neutral-700 my-6 rounded-[1px]" />

      {/* Bio paragraphs */}
      {bioParagraphs.length > 0 ? (
        <div className="space-y-6">
          {bioParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-neutral-400 leading-relaxed text-[15px] sm:text-[16px]"
            >
              <FormattedText text={paragraph} />
            </p>
          ))}
        </div>
      ) : tagline && tagline !== displayName ? (
        <p className="text-neutral-400 leading-relaxed text-[15px] sm:text-[16px]">
          <FormattedText text={tagline} />
        </p>
      ) : null}
    </header>
  );
}
