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

// Non-profile paths on x.com / twitter.com that must not be treated as a handle
const X_RESERVED_PATHS = new Set([
  "home",
  "intent",
  "search",
  "explore",
  "notifications",
  "messages",
  "settings",
  "i",
  "share",
  "compose",
  "hashtag",
  "status",
  "jobs",
  "about",
  "login",
  "signup",
  "signin",
  "download",
  "verified",
  "privacy",
  "terms",
  "tos",
  "help",
  "developers",
]);

/** Extracts the @handle from an X/Twitter profile URL (e.g. https://x.com/angshuman). */
function extractXHandle(href?: string): string {
  if (!href) return "";
  try {
    const url = new URL(href, "https://x.com");
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const isXHost =
      host === "x.com" ||
      host.endsWith(".x.com") ||
      host === "twitter.com" ||
      host.endsWith(".twitter.com");
    if (!isXHost) return "";

    // e.g. https://x.com/intent/user?screen_name=angshuman
    const screenName = url.searchParams.get("screen_name");
    if (screenName) return screenName.replace(/^@/, "");

    const [firstSegment] = url.pathname.split("/").filter(Boolean);
    if (!firstSegment || X_RESERVED_PATHS.has(firstSegment.toLowerCase())) {
      return "";
    }
    // X handles are 1-15 chars of letters, digits, underscores
    return /^[A-Za-z0-9_]{1,15}$/.test(firstSegment) ? firstSegment : "";
  } catch {
    return "";
  }
}

export default function Hero({
  profile,
  user,
  avatar,
  name,
}: HeroProps) {
  const bio = textValue(profile?.bio);
  const rawName = name || textValue(profile?.name) || textValue(user?.name);
  const tagline = textValue(profile?.tagline);

  // Only show an X handle when the user added an X/Twitter link — never invent one
  const links = normalizeLinks(profile?.links);
  const xLink = links.find(
    (l) =>
      /x\.com|twitter\.com/i.test(l.href) ||
      /^(x|twitter)$/i.test(l.label)
  );
  const handle = xLink ? extractXHandle(xLink.href) : "";
  const displayHandle = handle ? `@${handle}` : "";

  // Heading: real X handle first, otherwise the person's name/tagline
  const heading = displayHandle || rawName || tagline;
  // Line under the handle (e.g. Angshuman Kashyap)
  const displayName = rawName || tagline;
  const subHeading =
    displayName && displayName !== heading ? displayName : "";

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
          {heading && (
            <h1 className="font-editorial-serif text-[22px] sm:text-[24px] font-normal tracking-[-0.01rem] text-neutral-100 leading-tight">
              {displayHandle && xLink ? (
                <Link
                  href={xLink.href}
                  target={shouldOpenInNewTab(xLink.href) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity"
                >
                  {displayHandle}
                </Link>
              ) : (
                heading
              )}
            </h1>
          )}

          {subHeading && (
            <p className="text-[14px] sm:text-[15px] text-neutral-400 font-normal leading-tight mt-1 truncate">
              {subHeading}
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
